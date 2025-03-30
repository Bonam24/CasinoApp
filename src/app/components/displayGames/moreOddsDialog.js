import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
  } from "@mui/material";
  
  export default function MoreOddsDialog({ 
    moreOddsOpen, 
    setMoreOddsOpen, 
    selectedMatchForMoreOdds, 
    getMoreOddsOptions, 
    handleAddToBetSlip,
    formatMatchDate,
    formatMatchTime
  }) {
    return (
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
              {getMoreOddsOptions(selectedMatchForMoreOdds.fixture.id).map((bet) => (
                <div key={bet.id} className="bg-gray-800 p-3 rounded-lg">
                  <h3 className="font-bold text-teal-400 mb-2">{bet.name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bet.values.map((value) => (
                      <Button
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
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoreOddsOpen(false)} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }