export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league');
    const season = searchParams.get('season');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
  
    const url = `https://v3.football.api-sports.io/fixtures?league=${league}&season=${season}&from=${from}&to=${to}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-apisports-key": process.env.SPORTS_API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
  
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }