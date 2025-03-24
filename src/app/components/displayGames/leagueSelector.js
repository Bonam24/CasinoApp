// components/LeagueSelector.js
import { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const initialLeagues = [
  { name: "Premier League", endpoint: "https://v3.football.api-sports.io/leagues?id=39" },
  { name: "La Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=140" },
  { name: "Serie A", endpoint: "https://v3.football.api-sports.io/leagues?id=135" },
  { name: "Bundesliga", endpoint: "https://v3.football.api-sports.io/leagues?id=78" },
  { name: "Ligue 1", endpoint: "https://v3.football.api-sports.io/leagues?id=61" },
  { name: "Eredivisie", endpoint: "https://v3.football.api-sports.io/leagues?id=88" },
  { name: "Primeira Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=94" },
  { name: "MLS", endpoint: "https://v3.football.api-sports.io/leagues?id=253" },
];

export default function LeagueSelector({ onLeagueSelect }) {
  const [selectedLeague, setSelectedLeague] = useState("");

  const handleChange = (event) => {
    const league = event.target.value;
    setSelectedLeague(league);
    onLeagueSelect(league);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select League</InputLabel>
      <Select value={selectedLeague} onChange={handleChange} label="Select League">
        {initialLeagues.map((league) => (
          <MenuItem key={league.endpoint} value={league.endpoint}>
            {league.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}