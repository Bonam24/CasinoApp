"use client";
import { 
  TextField,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from "@mui/material";

const BetSlip = ({ 
  bets, 
  onRemoveBet, 
  onPlaceBet, 
  betAmount, 
  onBetAmountChange,
  isMobile = false,
  open = false,
  onClose = () => {}
}) => {
  const calculatePotentialReturn = () => {
    if (!betAmount || isNaN(betAmount)) return "0.00";
    const amount = parseFloat(betAmount);
    if (amount <= 0 || bets.length === 0) return "0.00";
    
    const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
    return (amount * totalOdds).toFixed(2);
  };

  const content = (
    <>
      {/* Scrollable bets list with fixed height */}
      <Box 
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          pr: 1,
          maxHeight: isMobile ? '60vh' : '50vh',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.3)',
          }
        }}
      >
        {bets.length > 0 ? (
          bets.map((bet) => (
            <div 
              key={bet.matchId} 
              className="bg-gray-700 p-3 rounded-lg mb-2 last:mb-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {bet.homeTeam} vs {bet.awayTeam}
                  </p>
                  <p className="text-xs text-gray-400">
                    {bet.date} {bet.time}
                  </p>
                  <p className="text-xs mt-1">
                    Bet: {bet.betType === 'home' ? 'Home Win' : 
                         bet.betType === 'away' ? 'Away Win' : 'Draw'} @ {bet.odds}
                  </p>
                </div>
                <button 
                  onClick={() => onRemoveBet(bet.matchId)}
                  className="text-gray-400 hover:text-white text-lg ml-2"
                  aria-label="Remove bet"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-gray-400 text-center">Add selections to your bet slip</p>
          </div>
        )}
      </Box>

      {/* Fixed bottom section */}
      <div className="mt-auto">
        <TextField
          label="Bet Amount"
          type="number"
          value={betAmount}
          onChange={(e) => onBetAmountChange(e.target.value)}
          fullWidth
          size="small"
          className="mb-3"
          inputProps={{ min: "1", step: "1" }}
          InputLabelProps={{
            className: "text-gray-300"
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gray.600",
              },
              "&:hover fieldset": {
                borderColor: "gray.500",
              },
              "&.Mui-focused fieldset": {
                borderColor: "teal.500",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          }}
        />

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-300">Potential Return:</span>
          <span className="font-bold text-teal-400">${calculatePotentialReturn()}</span>
        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={bets.length === 0 || !betAmount}
          onClick={onPlaceBet}
          className="bg-teal-600 hover:bg-teal-700"
          sx={{ py: 1.5 }}
        >
          Place Bet
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={true}
        PaperProps={{
          style: {
            backgroundColor: '#1F2937',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        <DialogTitle className="text-teal-400" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          Your Bet Slip
        </DialogTitle>
        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {content}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            fullWidth
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div className="w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col" style={{ maxHeight: '90vh' }}>
      <h2 className="text-lg font-bold text-teal-400 mb-4">Bet Slip</h2>
      {content}
    </div>
  );
};

export default BetSlip;