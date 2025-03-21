import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardMedia, CardContent } from '@mui/material';

const leaguesData = {
  leagues: [
    { name: 'Premier League', endpoint: 'https://v3.football.api-sports.io/leagues?id=39' },
    { name: 'La Liga', endpoint: 'https://v3.football.api-sports.io/leagues?id=140' },
    { name: 'Serie A', endpoint: 'https://v3.football.api-sports.io/leagues?id=135' },
    { name: 'Bundesliga', endpoint: 'https://v3.football.api-sports.io/leagues?id=78' },
    { name: 'Ligue 1', endpoint: 'https://v3.football.api-sports.io/leagues?id=61' },
    { name: 'Eredivisie', endpoint: 'https://v3.football.api-sports.io/leagues?id=88' },
    { name: 'Primeira Liga', endpoint: 'https://v3.football.api-sports.io/leagues?id=94' },
    { name: 'MLS', endpoint: 'https://v3.football.api-sports.io/leagues?id=253' },
    {name:"UEFA champions league", endpoint:"https://v3.football.api-sports.io/leagues?id=2"},
    {name:"Europa League", endpoint:"https://v3.football.api-sports.io/leagues?id=3"},
  ],
};

const LeagueInfo = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllLeagues = async () => {
      try {
        const leaguePromises = leaguesData.leagues.map(async (league) => {
          const response = await fetch(league.endpoint, {
            headers: {
              'x-apisports-key': 'aa2a46cd86fefe10bf10a5358b1769a3',
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${league.name}`);
          }

          const data = await response.json();
          return data.response[0]; // Assuming the API returns an array with one league object
        });

        const leagueResults = await Promise.all(leaguePromises);
        setLeagues(leagueResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeagues();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#13dfae', // Use the teal color for the heading
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        Football Leagues
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {leagues.map((league, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  borderColor: '#13dfae', // Add a teal border on hover
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: '120px',
                  objectFit: 'contain',
                  p: 2,
                  backgroundColor: '#f5f5f5', // Light gray background for the logo
                }}
                image={league.league.logo}
                alt={league.league.name}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: '#223', // White background for the content
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#13dfae',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {league.league.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LeagueInfo;