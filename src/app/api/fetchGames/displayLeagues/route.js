import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const sport = searchParams.get('sport');

  if (!id || !sport) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const apiVersions = {
      football: 'v3',
      hockey: 'v1',
      baseball: 'v1',
      basketball: 'v1',
      'formula-1': 'v1',
      rugby: 'v1',
      afl: 'v1'
    };

    const version = apiVersions[sport] || 'v1';
    const apiUrl = `https://${version}.${sport}.api-sports.io/leagues?id=${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        'x-apisports-key': process.env.SPORTS_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Optionally add other HTTP methods
export async function POST(request) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}