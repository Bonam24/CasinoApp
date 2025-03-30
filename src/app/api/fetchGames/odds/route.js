export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return Response.json(
      { error: "Endpoint parameter is required" },
      { status: 400 }
    );
  }

  try {
    const decodedEndpoint = decodeURIComponent(endpoint);
    console.log("Fetching odds from:", decodedEndpoint); // For debugging

    const response = await fetch(decodedEndpoint, {
      method: "GET",
      headers: {
        "x-apisports-key": process.env.SPORTS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData); // Log detailed error
      throw new Error(
        `Failed to fetch odds: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in odds API route:", error);
    return Response.json(
      { error: error.message || "Failed to fetch odds data" },
      { status: 500 }
    );
  }
}