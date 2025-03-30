import { useState, useEffect } from "react";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Avatar
} from "@mui/material";

export default function SportLeagueSelectors({ 
  sportsData, 
  selectedSport, 
  setSelectedSport, 
  selectedLeague, 
  setSelectedLeague,
  setMatches,
  setOddsData
}) {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    if (selectedSport) {
      const fetchLeagueLogos = async () => {
        const updatedLeagues = await Promise.all(
          selectedSport.leagues.map(async (league) => {
            try {
              const response = await fetch(league.endpoint, {
                method: "GET",
                headers: {
                  "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
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
    }
  }, [selectedSport]);

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedLeague(null);
    setMatches([]);
    setOddsData({});
  };

  const handleLeagueSelect = (leagueEndpoint) => {
    setSelectedLeague(leagueEndpoint);
  };

  return (
    <div className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sport Selector */}
      <FormControl fullWidth>
        <InputLabel id="sport-select-label" className="text-gray-300 text-sm sm:text-base">
          Select Sport
        </InputLabel>
        <Select
          labelId="sport-select-label"
          value={selectedSport?.name || ""}
          label="Select Sport"
          onChange={(e) => {
            const sport = sportsData.find(s => s.name === e.target.value);
            handleSportSelect(sport);
          }}
          className="bg-teal-100 text-white rounded-lg"
          sx={{
            "& .MuiSelect-icon": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
          }}
        >
          {sportsData.map((sport) => (
            <MenuItem 
              key={sport.name} 
              value={sport.name}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <span className="text-sm sm:text-base">{sport.name}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* League Selector */}
      {selectedSport && (
        <FormControl fullWidth>
          <InputLabel id="league-select-label" className="text-gray-300 text-sm sm:text-base">
            Select League
          </InputLabel>
          <Select
            labelId="league-select-label"
            value={selectedLeague || ""}
            label="Select League"
            onChange={(e) => handleLeagueSelect(e.target.value)}
            className="bg-teal-100 text-white rounded-lg"
            sx={{
              "& .MuiSelect-icon": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
            }}
            renderValue={(selected) => {
              const selectedLeagueData = leagues.find((league) => league.endpoint === selected);
              return (
                <div className="flex items-center gap-2">
                  {selectedLeagueData?.logo && (
                    <img 
                      src={selectedLeagueData.logo} 
                      alt={selectedLeagueData.name} 
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                  )}
                  <span className="text-sm sm:text-base">{selectedLeagueData?.name}</span>
                </div>
              );
            }}
          >
            {leagues.map((league) => (
              <MenuItem 
                key={league.endpoint} 
                value={league.endpoint}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <div className="flex items-center gap-2">
                  {league.logo && (
                    <img src={league.logo} alt={league.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  <span className="text-sm sm:text-base">{league.name}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}