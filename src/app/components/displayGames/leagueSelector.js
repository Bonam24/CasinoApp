import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Avatar } from "@mui/material";

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

export default function LeagueSelector({ selectedLeague, setSelectedLeague }) {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const fetchLeagueLogos = async () => {
      const updatedLeagues = await Promise.all(
        initialLeagues.map(async (league) => {
          try {
            const response = await fetch(league.endpoint, {
              method: "GET",
              headers: {
                "x-apisports-key": "aa2a46cd86fefe10bf10a5358b1769a3",
              },
            });
            if (!response.ok) throw new Error("Failed to fetch league data");
            const data = await response.json();
            const logo = data.response[0]?.league?.logo || "";
            return { ...league, logo };
          } catch (error) {
            console.error(`Error fetching logo for ${league.name}:`, error);
            return { ...league, logo: "" };
          }
        })
      );
      setLeagues(updatedLeagues);
    };

    fetchLeagueLogos();
  }, []);

  return (
    <FormControl fullWidth sx={{ marginBottom: 3 }}>
      <InputLabel id="league-select-label" className="text-white">
        Select League
      </InputLabel>
      <Select
        labelId="league-select-label"
        value={selectedLeague}
        label="Select League"
        onChange={(e) => setSelectedLeague(e.target.value)}
        className="text-white"
        sx={{
          backgroundColor: "#111",
          color: "white",
          "& .MuiSelect-icon": { color: "white" },
        }}
        renderValue={(selected) => {
          const selectedLeagueData = leagues.find((league) => league.endpoint === selected);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                src={selectedLeagueData?.logo}
                alt={selectedLeagueData?.name}
                sx={{ width: 24, height: 24 }}
              />
              {selectedLeagueData?.name}
            </div>
          );
        }}
      >
        {leagues.map((league) => (
          <MenuItem key={league.endpoint} value={league.endpoint} className="text-white">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar src={league.logo} alt={league.name} sx={{ width: 24, height: 24 }} />
              {league.name}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}