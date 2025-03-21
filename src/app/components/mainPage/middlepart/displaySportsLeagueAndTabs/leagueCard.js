// components/LeagueCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const LeagueCard = () => {
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await axios.get('https://v3.football.api-sports.io/leagues?id=78', {
          headers: {
            'x-apisports-key': 'aa2a46cd86fefe10bf10a5358b1769a3',
          },
        });

        if (response.data && response.data.response.length > 0) {
          setLeagueData(response.data.response[0]);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', mt: 4 }}>
      {leagueData?.league?.logo && (
        <CardMedia
          component="img"
          height="140"
          image={leagueData.league.logo}
          alt={leagueData.league.name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {leagueData?.league?.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LeagueCard;