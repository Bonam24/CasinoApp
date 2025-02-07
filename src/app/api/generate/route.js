import { GoogleGenerativeAI } from "@google/generative-ai";

async function generateResponse(prompt, retries = 3) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      if (error.message.includes("429 Too Many Requests") && i < retries - 1) {
        console.warn(`Rate limit hit. Retrying in ${2 ** i} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i)); // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text = await generateResponse(prompt);

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message.includes("429 Too Many Requests")
          ? "API rate limit exceeded. Please wait before trying again."
          : error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
