import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

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
    { name: 'UEFA Champions League', endpoint: 'https://v3.football.api-sports.io/leagues?id=2' },
    { name: 'Europa League', endpoint: 'https://v3.football.api-sports.io/leagues?id=3' },
  ],
};

const SelectLeague = () => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [leagueLogos, setLeagueLogos] = useState({}); // Store logos for each league
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch logos for all leagues on component mount
  useEffect(() => {
    const fetchLogos = async () => {
      const logos = {};
      for (const league of leaguesData.leagues) {
        try {
          const response = await fetch(league.endpoint, {
            headers: {
              'x-apisports-key': 'aa2a46cd86fefe10bf10a5358b1769a3',
            },
          });
          if (!response.ok) throw new Error(`Failed to fetch logo for ${league.name}`);
          const data = await response.json();
          logos[league.endpoint] = data.response[0].league.logo; // Store the logo URL
        } catch (err) {
          console.error(err);
          logos[league.endpoint] = null; // Use null if logo fetch fails
        }
      }
      setLeagueLogos(logos);
    };

    fetchLogos();
  }, []);

  const handleLeagueChange = async (event) => {
    const selectedEndpoint = event.target.value;
    setSelectedLeague(selectedEndpoint);

    if (!selectedEndpoint) {
      setLeagueDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(selectedEndpoint, {
        headers: {
          'x-apisports-key': process.env.NEXT_PUBLIC_SPORTS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch league data');
      }

      const data = await response.json();
      setLeagueDetails(data.response[0]); // Assuming the API returns an array with one league object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#13dfae',
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        Select a League
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="league-select-label">Select a League</InputLabel>
        <Select
          labelId="league-select-label"
          value={selectedLeague || ''}
          onChange={handleLeagueChange}
          label="Select a League"
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
          }}
          renderValue={(selected) => {
            if (!selected) return 'Select a League';
            const selectedLeagueData = leaguesData.leagues.find(
              (league) => league.endpoint === selected
            );
            return (
              <Box display="flex" alignItems="center">
                <img
                  src={leagueLogos[selected]}
                  alt={selectedLeagueData?.name}
                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                />
                <Typography>{selectedLeagueData?.name}</Typography>
              </Box>
            );
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {leaguesData.leagues.map((league, index) => (
            <MenuItem key={index} value={league.endpoint}>
              <Box display="flex" alignItems="center">
                <img
                  src={leagueLogos[league.endpoint]}
                  alt={league.name}
                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                />
                <Typography>{league.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display the statement when a league is selected */}
      {selectedLeague && leagueDetails && (
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold',
          color: '#13dfae',
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: '2px', }}>
          Displaying matches for {leagueDetails.league.name}
        </Typography>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SelectLeague;