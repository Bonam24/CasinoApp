import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Determines if a query requires real-time data using keywords and regex patterns.
 */
function shouldUseGoogleSearch(query) {
  const realTimeKeywords = [
    "latest", "news", "current", "trending", "price", "today", "update",
    "new", "live", "breaking", "forecast", "next", "upcoming", "schedule"
  ];

  const realTimePatterns = [
    /\b(stock|crypto|currency) price\b/i,
    /\b(score|match result|weather in)\b/i,
    /\b(who won|who is leading|election results|next game|next match)\b/i
  ];

  return realTimeKeywords.some((word) => query.toLowerCase().includes(word)) ||
         realTimePatterns.some((pattern) => pattern.test(query));
}

/**
 * Fetches search results from Google Search API (SerpAPI).
 */
async function fetchSearchResults(query) {
  try {
    console.log(`🔍 Fetching Google Search results for: ${query}`);
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
    const response = await axios.get(url);

    if (response.data?.organic_results?.length > 0) {
      return response.data.organic_results.map((result) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
      }));
    }
    return [];
  } catch (error) {
    console.error("❌ SerpAPI Error:", error.message);
    return [];
  }
}

/**
 * Extracts the closest upcoming match from search results.
 */
function getClosestMatch(searchResults) {
  const today = new Date();
  let closestMatch = null;

  for (const result of searchResults) {
    const matchDateMatch = result.snippet.match(/\b(\d{1,2} \w+ \d{4})\b/); // Example: "12 February 2025"
    if (matchDateMatch) {
      const matchDate = new Date(matchDateMatch[0]);

      // Ensure it's a future match and the closest one
      if (matchDate > today && (!closestMatch || matchDate < new Date(closestMatch.date))) {
        closestMatch = { ...result, date: matchDateMatch[0] };
      }
    }
  }

  return closestMatch;
}

/**
 * Calls Gemini AI to generate a structured response using provided context.
 */
async function generateGeminiResponse(prompt, context = "") {
  try {
    console.log("🤖 Structuring response with Gemini AI...");
    const fullPrompt = context 
      ? `Use the following real-time search results to provide an accurate and structured response to the query: "${prompt}".\n\nSearch Results:\n${context}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    return "Sorry, I couldn't generate a response at this time.";
  }
}

/**
 * Generates a well-structured response using both real-time search data and Gemini AI.
 */
async function generateHybridResponse(prompt) {
  const searchResults = await fetchSearchResults(prompt);

  if (searchResults.length === 0) {
    console.log("❌ No relevant real-time data found. Using Gemini AI only.");
    return generateGeminiResponse(prompt);
  }

  // Extract closest upcoming match
  const closestMatch = getClosestMatch(searchResults);

  if (!closestMatch) {
    console.log("❌ Could not find a valid match date. Using Gemini AI only.");
    return generateGeminiResponse(prompt);
  }

  // Format the closest match as context for Gemini AI
  const matchContext = `The next match is **${closestMatch.title}** on **${closestMatch.date}**.\n\n${closestMatch.snippet}\n[Read more](${closestMatch.link})\n`;

  return generateGeminiResponse(prompt, matchContext);
}

/**
 * API Route for chatbot.
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let responseText;

    if (shouldUseGoogleSearch(prompt)) {
      console.log("🟢 Using Google Search API + Gemini AI (Structured Response)");
      responseText = await generateHybridResponse(prompt);
    } else {
      console.log("🟡 Using Gemini AI only");
      responseText = await generateGeminiResponse(prompt);
    }

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
