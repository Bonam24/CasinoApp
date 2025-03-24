// components/FixtureList.js
import { useState, useEffect } from "react";
import { Grid, Typography, Card, CardContent } from "@mui/material";

export default function FixtureList({ leagueEndpoint }) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    if (leagueEndpoint) {
      fetchFixtures(leagueEndpoint);
    }
  }, [leagueEndpoint]);

  const fetchFixtures = async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "x-apisports-key": "aa2a46cd86fefe10bf10a5358b1769a3",
        },
      });
      const data = await response.json();
      setFixtures(data.response);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  return (
    <Grid container spacing={2} sx={{bgcolor:"white"}}>
      {fixtures.map((fixture) => (
        <Grid item xs={12} sm={6} md={4} key={fixture.fixture.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {fixture.teams.home.name} vs {fixture.teams.away.name}
              </Typography>
              <Typography>{new Date(fixture.fixture.date).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}