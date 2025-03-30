import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
    Avatar,
    Divider,
    Chip
  } from "@mui/material";
  
  export default function PredictionsDialog({ 
    predictionsOpen, 
    setPredictionsOpen, 
    selectedMatchForPredictions, 
    predictionsData, 
    loadingPredictions,
    formatMatchDate,
    formatMatchTime
  }) {
    const renderPredictionComparison = (home, draw, away) => {
      const total = home + draw + away;
      const homePercent = Math.round((home / total) * 100);
      const drawPercent = Math.round((draw / total) * 100);
      const awayPercent = Math.round((away / total) * 100);
  
      return (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Home: {homePercent}%</span>
            <span className="text-sm font-medium">Draw: {drawPercent}%</span>
            <span className="text-sm font-medium">Away: {awayPercent}%</span>
          </div>
          <div className="flex h-4 rounded-md overflow-hidden">
            <div 
              className="bg-blue-500" 
              style={{ width: `${homePercent}%` }}
              title={`Home: ${homePercent}%`}
            ></div>
            <div 
              className="bg-gray-500" 
              style={{ width: `${drawPercent}%` }}
              title={`Draw: ${drawPercent}%`}
            ></div>
            <div 
              className="bg-red-500" 
              style={{ width: `${awayPercent}%` }}
              title={`Away: ${awayPercent}%`}
            ></div>
          </div>
        </div>
      );
    };
  
    return (
      <Dialog
        open={predictionsOpen}
        onClose={() => setPredictionsOpen(false)}
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
          {selectedMatchForPredictions && (
            <>
              Match Prediction: {selectedMatchForPredictions.teams.home.name} vs {selectedMatchForPredictions.teams.away.name}
              <div className="text-sm text-gray-400">
                {formatMatchDate(selectedMatchForPredictions?.fixture.date)} at {formatMatchTime(selectedMatchForPredictions?.fixture.date)}
              </div>
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {loadingPredictions ? (
            <div className="flex justify-center items-center h-40">
              <CircularProgress />
            </div>
          ) : predictionsData ? (
            <div className="space-y-4">
              {/* Match Info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar src={selectedMatchForPredictions?.teams.home.logo} />
                  <span className="font-medium">{selectedMatchForPredictions?.teams.home.name}</span>
                </div>
                <span className="mx-2 font-bold">vs</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedMatchForPredictions?.teams.away.name}</span>
                  <Avatar src={selectedMatchForPredictions?.teams.away.logo} />
                </div>
              </div>
  
              <Divider className="my-3 bg-gray-600" />
  
              {/* Prediction Comparison */}
              <div>
                <h3 className="font-bold text-lg mb-2">Prediction Comparison</h3>
                {renderPredictionComparison(
                  predictionsData.predictions.percent.home,
                  predictionsData.predictions.percent.draw,
                  predictionsData.predictions.percent.away
                )}
              </div>
  
              {/* Winner Prediction */}
              <div>
                <h3 className="font-bold text-lg mb-2">Winner Prediction</h3>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Predicted Winner:</span>
                    <Chip 
                      label={predictionsData.predictions.winner?.name || 'No clear winner'} 
                      color={
                        predictionsData.predictions.winner?.id === selectedMatchForPredictions?.teams.home.id ? 'primary' :
                        predictionsData.predictions.winner?.id === selectedMatchForPredictions?.teams.away.id ? 'error' : 'default'
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-400">Advice: {predictionsData.predictions.advice || 'No advice available'}</span>
                  </div>
                </div>
              </div>
  
              {/* Goals Stats */}
              <div>
                <h3 className="font-bold text-lg mb-2">Goals Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-teal-400 mb-1">Home Team</h4>
                    <p className="text-sm">Goals For: {predictionsData.teams.home.league.goals?.for?.total?.average || 'N/A'}</p>
                    <p className="text-sm">Goals Against: {predictionsData.teams.home.league.goals?.against?.total?.average || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-teal-400 mb-1">Away Team</h4>
                    <p className="text-sm">Goals For: {predictionsData.teams.away.league.goals?.for?.total?.average || 'N/A'}</p>
                    <p className="text-sm">Goals Against: {predictionsData.teams.away.league.goals?.against?.total?.average || 'N/A'}</p>
                  </div>
                </div>
              </div>
  
              {/* H2H Stats */}
              {predictionsData.h2h.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Last 5 Head-to-Head Matches</h3>
                  <div className="space-y-2">
                    {predictionsData.h2h.slice(0, 5).map((match, index) => (
                      <div key={index} className="bg-gray-800 p-2 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{new Date(match.fixture.date).toLocaleDateString()}</span>
                          <span className="text-sm font-bold">
                            {match.teams.home.name} {match.goals.home} - {match.goals.away} {match.teams.away.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Typography variant="h6" className="text-gray-400">
                No prediction data available for this match
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionsOpen(false)} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }