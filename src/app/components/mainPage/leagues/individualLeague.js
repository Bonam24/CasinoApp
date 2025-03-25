import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardMedia, CardContent, useMediaQuery } from '@mui/material';

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
    { name: "UEFA Champions League", endpoint: "https://v3.football.api-sports.io/leagues?id=2" },
    { name: "Europa League", endpoint: "https://v3.football.api-sports.io/leagues?id=3" },
  ],
};

const LeagueInfo = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
          return data.response[0];
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
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#13dfae',
          mb: isSmallScreen ? 2 : 4,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Football Leagues
      </Typography>
      <Grid container spacing={isSmallScreen ? 1 : 3} justifyContent="center">
        {leagues.map((league, index) => (
          <Grid item xs={6} md={3} key={index}> {/* Changed to xs=6 (2 per row) and md=3 (4 per row) */}
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid transparent',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderColor: '#13dfae',
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: isSmallScreen ? '80px' : '120px',
                  objectFit: 'contain',
                  p: isSmallScreen ? 1 : 2,
                  backgroundColor: '#f5f5f5',
                }}
                image={league.league.logo}
                alt={league.league.name}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  textAlign: 'center',
                  p: isSmallScreen ? 1 : 2,
                  backgroundColor: '#223',
                }}
              >
                <Typography
                  variant={isSmallScreen ? "body2" : "subtitle1"}
                  sx={{
                    fontWeight: 'bold',
                    color: '#13dfae',
                    textTransform: 'uppercase',
                    fontSize: isSmallScreen ? '0.7rem' : '0.875rem',
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