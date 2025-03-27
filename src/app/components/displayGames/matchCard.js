// components/MatchCard.js
import { useState } from "react";
import { Avatar, Button } from "@mui/material";
import { FaEllipsisV } from "react-icons/fa";

export default function MatchCard({ 
  match, 
  isSmallScreen, 
  handleMenuOpen, 
  handleAddToBetSlip, 
  handlePredictClick, 
  handleMoreClick 
}) {
  const generateRandomOdds = () => (Math.random() * 5 + 1).toFixed(2);
  const homeOdds = generateRandomOdds();
  const drawOdds = generateRandomOdds();
  const awayOdds = generateRandomOdds();

  const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div 
      key={match.fixture.id} 
      className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-teal-500 hover:bg-gray-700 transition-colors"
    >
      {/* Date and Time */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-teal-400">
            {formatMatchDate(match.fixture.date)}
          </span>
          <span className="text-xs sm:text-sm text-gray-400">
            {formatMatchTime(match.fixture.date)}
          </span>
        </div>
        
        {isSmallScreen && (
          <button 
            onClick={(e) => handleMenuOpen(e, match.fixture.id)}
            className="text-gray-400 hover:text-white"
          >
            <FaEllipsisV />
          </button>
        )}
      </div>
      
      {/* Teams and bet buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        {/* Teams */}
        <div className="flex-1 flex items-center gap-1 min-w-0">
          <div className="flex items-center gap-1">
            <Avatar 
              src={match.teams.home.logo} 
              alt={match.teams.home.name}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
              {match.teams.home.name}
            </span>
          </div>
          
          <span className="mx-1 text-xs sm:text-sm font-bold">vs</span>
          
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
              {match.teams.away.name}
            </span>
            <Avatar 
              src={match.teams.away.logo} 
              alt={match.teams.away.name}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </div>

        {/* Bet buttons */}
        {!isSmallScreen && (
          <div className="flex gap-1">
            <Button 
              variant="contained" 
              size="small"
              color="primary"
              className="text-xs px-2 py-1 min-w-0"
              onClick={() => handleAddToBetSlip(match, 'home', homeOdds)}
              startIcon={<Avatar src={match.teams.home.logo} className="w-3 h-3" />}
            >
              {homeOdds}
            </Button>
            <Button 
              variant="contained" 
              size="small"
              color="secondary"
              className="text-xs px-2 py-1 min-w-0"
              onClick={() => handleAddToBetSlip(match, 'draw', drawOdds)}
            >
              {drawOdds}
            </Button>
            <Button 
              variant="contained" 
              size="small"
              color="error"
              className="text-xs px-2 py-1 min-w-0"
              onClick={() => handleAddToBetSlip(match, 'away', awayOdds)}
              startIcon={<Avatar src={match.teams.away.logo} className="w-3 h-3" />}
            >
              {awayOdds}
            </Button>
          </div>
        )}
      </div>

      {/* Score and action buttons */}
      <div className="flex justify-between items-center">
        {/* Score */}
        {match.goals.home !== null && match.goals.away !== null && (
          <div className="inline-flex items-center bg-gray-700 px-2 py-0.5 rounded-full">
            <span className="text-xs sm:text-sm font-bold">
              {match.goals.home} - {match.goals.away}
            </span>
          </div>
        )}

        {/* Predict and More buttons */}
        {!isSmallScreen && (
          <div className="flex gap-1 ml-auto">
            <Button 
              variant="outlined" 
              size="small"
              color="info"
              className="text-xs px-2 py-1 min-w-0"
              onClick={() => handlePredictClick(match)}
            >
              Predict
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              color="inherit"
              className="text-xs px-2 py-1 min-w-0"
              onClick={() => handleMoreClick(match)}
            >
              More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}