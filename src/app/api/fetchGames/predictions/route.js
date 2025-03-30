export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fixture = searchParams.get('fixture');

  if (!fixture) {
    return new Response(JSON.stringify({ error: "Fixture ID is required" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const apiUrl = `https://v3.football.api-sports.io/predictions?fixture=${fixture}`;
    console.log("[DEBUG] Fetching predictions from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-apisports-key": process.env.SPORTS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[ERROR] Predictions API Response:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("[ERROR] in predictions route:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to fetch predictions" 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}