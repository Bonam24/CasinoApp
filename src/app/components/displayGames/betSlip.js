// components/BetSlip.js
import { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from "@mui/material";

export default function BetSlip({ 
  betSlip, 
  handleRemoveFromBetSlip, 
  betAmount, 
  setBetAmount, 
  calculatePotentialReturn, 
  handlePlaceBet,
  mobileBetSlipOpen,
  setMobileBetSlipOpen,
  isSmallScreen,
  isMediumScreen
}) {
  return (
    <>
      {/* Desktop Bet Slip */}
      {!isMediumScreen && (
        <div className="hidden md:block md:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold text-teal-400 mb-4">Bet Slip</h2>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
            {betSlip.length > 0 ? (
              betSlip.map((bet) => (
                <div key={bet.matchId} className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
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
                      onClick={() => handleRemoveFromBetSlip(bet.matchId)}
                      className="text-gray-400 hover:text-white text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-gray-400 text-center">Add selections to your bet slip</p>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <TextField
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              fullWidth
              size="small"
              className="mb-3"
              inputProps={{
                min: "1",
                step: "1"
              }}
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
              disabled={betSlip.length === 0 || !betAmount}
              onClick={handlePlaceBet}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Place Bet
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bet Slip Button */}
      {isMediumScreen && betSlip.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 border-t border-gray-700 z-10">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setMobileBetSlipOpen(true)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            View Bet Slip ({betSlip.length})
          </Button>
        </div>
      )}

      {/* Mobile Bet Slip Dialog */}
      <Dialog
        open={mobileBetSlipOpen}
        onClose={() => setMobileBetSlipOpen(false)}
        fullScreen={isSmallScreen}
        PaperProps={{
          style: {
            backgroundColor: '#1F2937',
            color: 'white',
          },
        }}
      >
        <DialogTitle className="text-teal-400">Your Bet Slip</DialogTitle>
        <DialogContent>
          <div className="space-y-3">
            {betSlip.length > 0 ? (
              betSlip.map((bet) => (
                <div key={bet.matchId} className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
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
                      onClick={() => handleRemoveFromBetSlip(bet.matchId)}
                      className="text-gray-400 hover:text-white text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No bets in your slip</p>
            )}
          </div>

          <div className="mt-4">
            <TextField
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              fullWidth
              size="small"
              className="mb-3"
              inputProps={{
                min: "1",
                step: "1"
              }}
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMobileBetSlipOpen(false)} color="inherit">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceBet}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Place Bet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}