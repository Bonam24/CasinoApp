"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from "@mui/material";

export const MoreOddsDialog = ({ 
  moreOddsOpen, 
  setMoreOddsOpen, 
  selectedMatchForMoreOdds, 
  oddsData, 
  handleAddToBetSlip,
  formatMatchDate,
  formatMatchTime
}) => (
  <Dialog
    open={moreOddsOpen}
    onClose={() => setMoreOddsOpen(false)}
    maxWidth="md"
    fullWidth
    PaperProps={{
      style: {
        backgroundColor: '#1F2937',
        color: 'white',
      },
    }}
  >
    <DialogTitle className="text-teal-400">
      {selectedMatchForMoreOdds && (
        <>
          {selectedMatchForMoreOdds.teams.home.name} vs {selectedMatchForMoreOdds.teams.away.name}
          <div className="text-sm text-gray-400">
            {formatMatchDate(selectedMatchForMoreOdds?.fixture.date)} at {formatMatchTime(selectedMatchForMoreOdds?.fixture.date)}
          </div>
        </>
      )}
    </DialogTitle>
    <DialogContent>
      {selectedMatchForMoreOdds && (
        <div className="space-y-4">
          {getMoreOddsOptions(selectedMatchForMoreOdds.fixture.id, oddsData).map((bet) => (
            <div key={bet.id} className="bg-gray-800 p-3 rounded-lg">
              <h3 className="font-bold text-teal-400 mb-2">{bet.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bet.values.map((value) => (
                  <MuiButton
                    key={value.value}
                    variant="outlined"
                    color="primary"
                    size="small"
                    className="text-xs"
                    onClick={() => {
                      handleAddToBetSlip(
                        selectedMatchForMoreOdds, 
                        `${bet.name} - ${value.value}`, 
                        value.odd
                      );
                      setMoreOddsOpen(false);
                    }}
                  >
                    {value.value} @ {value.odd}
                  </MuiButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
    <DialogActions>
      <MuiButton onClick={() => setMoreOddsOpen(false)} color="inherit">
        Close
      </MuiButton>
    </DialogActions>
  </Dialog>
);

// Helper function
const getMoreOddsOptions = (matchId, oddsData) => {
  const odds = oddsData[matchId];
  if (!odds) return [];
  
  const bookmaker = odds.bookmakers?.[0];
  if (!bookmaker) return [];
  
  return bookmaker.bets.filter(bet => bet.id !== 1);
};