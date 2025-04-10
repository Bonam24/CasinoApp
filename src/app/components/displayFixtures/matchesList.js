"use client";
import { Typography } from "@mui/material";
import TeamSportMatches from "@/app/components/displayFixtures/teamSportsMatches";

export const MatchesList = ({ 
  selectedLeague, 
  leagues, 
  matches, 
  currentMatches, 
  oddsData, 
  loadingOdds, 
  handleAddToBetSlip, 
  setSelectedMatchForPredictions, 
  fetchPredictions, 
  setPredictionsOpen, 
  setSelectedMatchForMoreOdds, 
  setMoreOddsOpen, 
  isSmallScreen,
  selectedSport // Add selectedSport as a prop
}) => (
  selectedLeague ? (
    <div className="flex-1 flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 mb-2">
        {leagues.find((league) => league.endpoint === selectedLeague)?.name} Matches
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {matches.length > 0 ? (
          <TeamSportMatches 
            matches={currentMatches}
            oddsData={oddsData}
            loadingOdds={loadingOdds}
            onAddToBetSlip={handleAddToBetSlip}
            onPredictClick={(match) => {
              setSelectedMatchForPredictions(match);
              fetchPredictions(match.fixture.id);
              setPredictionsOpen(true);
            }}
            onMoreClick={(match) => {
              setSelectedMatchForMoreOdds(match);
              setMoreOddsOpen(true);
            }}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          <div className="text-center py-6 sm:py-8 bg-gray-800 rounded-lg">
            <Typography variant="h6" className="text-gray-400 text-sm sm:text-base">
              No matches available for this league
            </Typography>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg">
      {selectedSport ? (
        <Typography variant="h6" className="text-gray-400 text-center">
          Please select a league to view matches
        </Typography>
      ) : (
        <Typography variant="h6" className="text-gray-400 text-center">
          Please select a sport to begin
        </Typography>
      )}
    </div>
  )
);