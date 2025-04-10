"use client";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const SportLeagueSelectors = ({ 
  sportsData, 
  selectedSport, 
  leagues, 
  selectedLeague, 
  handleSportSelect, 
  handleLeagueSelect 
}) => (
  <div className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormControl fullWidth>
      <InputLabel id="sport-select-label" className="text-gray-300 text-sm sm:text-base">
        Select Sport
      </InputLabel>
      <Select
        labelId="sport-select-label"
        value={selectedSport?.name || ""}
        label="Select Sport"
        onChange={(e) => handleSportSelect(e.target.value)}
        className="bg-teal-100 text-white rounded-lg"
        sx={{
          "& .MuiSelect-icon": { color: "white" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
        }}
      >
        {sportsData.map((sport) => (
          <MenuItem key={sport.name} value={sport.name} className="bg-gray-800 hover:bg-gray-700 text-white">
            <span className="text-sm sm:text-base">{sport.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>

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