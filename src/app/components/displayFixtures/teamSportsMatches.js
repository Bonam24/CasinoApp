"use client";
import { useState } from "react";
import { 
  Button,
  Avatar,
  Divider,
  Chip,
  CircularProgress
} from "@mui/material";
import { formatMatchTime, formatMatchDate } from "@/app/utils/Date/dateUtils";

const TeamSportMatches = ({ 
  matches, 
  oddsData, 
  loadingOdds,
  onAddToBetSlip,
  onPredictClick,
  onMoreClick 
}) => {
  const getMatchOdds = (matchId) => {
    const odds = oddsData[matchId];
    if (!odds) return null;
    
    for (const bookmaker of odds.bookmakers || []) {
      const matchWinnerBet = bookmaker.bets.find(bet => bet.id === 1);
      if (!matchWinnerBet) continue;
      
      const homeOdd = matchWinnerBet.values.find(v => v.value === "Home")?.odd;
      const drawOdd = matchWinnerBet.values.find(v => v.value === "Draw")?.odd;
      const awayOdd = matchWinnerBet.values.find(v => v.value === "Away")?.odd;
      
      if (homeOdd && drawOdd && awayOdd) {
        return {
          home: homeOdd,
          draw: drawOdd,
          away: awayOdd
        };
      }
    }
    
    return null;
  };

  return (
    <div className="grid gap-3 sm:gap-4">
      {matches.map((match) => {
        const odds = getMatchOdds(match.fixture.id);
        const homeOdds = odds?.home || "N/A";
        const drawOdds = odds?.draw || "N/A";
        const awayOdds = odds?.away || "N/A";

        return (
          <div 
            key={match.fixture.id} 
            className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-teal-500 hover:bg-gray-700 transition-colors"
          >
            {/* Match header with date/time */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-teal-400">
                  {formatMatchDate(match.fixture.date)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">
                  {formatMatchTime(match.fixture.date)}
                </span>
              </div>
            </div>
            
            {/* Teams and odds */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <div className="flex-1 flex items-center gap-1 min-w-0">
                {/* Home team */}
                <div className="flex items-center gap-1">
                  <Avatar src={match.teams.home.logo} className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {match.teams.home.name}
                  </span>
                </div>
                
                <span className="mx-1 text-xs sm:text-sm font-bold">vs</span>
                
                {/* Away team */}
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {match.teams.away.name}
                  </span>
                  <Avatar src={match.teams.away.logo} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              {/* Odds buttons */}
              <div className="flex gap-1">
                <Button 
                  variant="contained" 
                  size="small"
                  color="primary"
                  onClick={() => onAddToBetSlip(match, 'home', homeOdds)}
                  startIcon={<Avatar src={match.teams.home.logo} className="w-3 h-3" />}
                  disabled={!odds?.home || loadingOdds[match.fixture.id]}
                >
                  {loadingOdds[match.fixture.id] ? <CircularProgress size={14} /> : homeOdds}
                </Button>
                
                <Button 
                  variant="contained" 
                  size="small"
                  color="secondary"
                  onClick={() => onAddToBetSlip(match, 'draw', drawOdds)}
                  disabled={!odds?.draw || loadingOdds[match.fixture.id]}
                >
                  {loadingOdds[match.fixture.id] ? <CircularProgress size={14} /> : drawOdds}
                </Button>
                
                <Button 
                  variant="contained" 
                  size="small"
                  color="error"
                  onClick={() => onAddToBetSlip(match, 'away', awayOdds)}
                  startIcon={<Avatar src={match.teams.away.logo} className="w-3 h-3" />}
                  disabled={!odds?.away || loadingOdds[match.fixture.id]}
                >
                  {loadingOdds[match.fixture.id] ? <CircularProgress size={14} /> : awayOdds}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              {match.goals.home !== null && match.goals.away !== null && (
                <div className="inline-flex items-center bg-gray-700 px-2 py-0.5 rounded-full">
                  <span className="text-xs sm:text-sm font-bold">
                    {match.goals.home} - {match.goals.away}
                  </span>
                </div>
              )}

              <div className="flex gap-1 ml-auto">
                <Button 
                  variant="outlined" 
                  size="small"
                  color="info"
                  onClick={() => onPredictClick(match)}
                >
                  Predict
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  color="inherit"
                  onClick={() => onMoreClick(match)}
                >
                  More
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamSportMatches;