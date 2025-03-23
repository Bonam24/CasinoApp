import { useState } from "react";
import { Card, CardContent, Typography, Button, TextField } from "@mui/material";

export default function BetSlip({ betSlip, handleRemoveBet, betAmount, setBetAmount, handlePlaceAllBets, handleCancelAllBets, calculatePotentialReturn, isSmallScreen, showBetSlip, setShowBetSlip }) {
  return (
    <>
      {!isSmallScreen ? (
        <Box sx={{ flex: 1, backgroundColor: "gray.800", padding: 2, borderRadius: 2, border: "1px solid #1E3A8A" }}>
          <Typography variant="h6" className="text-white mb-4">
            Bet Slip
          </Typography>
          {betSlip.length > 0 ? (
            <div>
              {betSlip.map((bet) => (
                <Card key={bet.matchId} className="mb-4 bg-gray-700 border border-[#1E3A8A]">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography className="text-white" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                          {bet.teams.home} vs {bet.teams.away}
                        </Typography>
                        <Typography className="text-white text-sm">
                          Bet: {bet.betType === "home" ? "Home Win" : bet.betType === "draw" ? "Draw" : "Away Win"} | Odds: {bet.odds}
                        </Typography>
                      </div>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveBet(bet.matchId)}
                        className="ml-2"
                        size={isSmallScreen ? "small" : "medium"}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <TextField
                label="Bet Amount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full mb-4"
                InputProps={{
                  className: "text-white",
                }}
              />
              <Typography className="text-white mb-4">
                Potential Return: {calculatePotentialReturn()}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceAllBets}
                  className="flex-1"
                >
                  Place Bet
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCancelAllBets}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          ) : (
            <Typography className="text-gray-400">
              No bets added yet.
            </Typography>
          )}
        </Box>
      ) : (
        <>
          {/* Fixed Button for Small Screens */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowBetSlip(!showBetSlip)}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1000,
              borderRadius: "50%",
              width: 56,
              height: 56,
              boxShadow: 3,
            }}
          >
            {showBetSlip ? "Close" : "Bet Slip"}
          </Button>

          {/* Bet Slip Drawer for Small Screens */}
          {showBetSlip && (
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                backgroundColor: "gray.800",
                padding: 2,
                borderRadius: "8px 8px 0 0",
                boxShadow: 3,
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" className="text-white mb-4">
                Bet Slip
              </Typography>
              {betSlip.length > 0 ? (
                <div>
                  {betSlip.map((bet) => (
                    <Card key={bet.matchId} className="mb-4 bg-gray-700 border border-[#1E3A8A]">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography className="text-white" sx={{ fontSize: "0.875rem" }}>
                              {bet.teams.home} vs {bet.teams.away}
                            </Typography>
                            <Typography className="text-white text-sm">
                              Bet: {bet.betType === "home" ? "Home Win" : bet.betType === "draw" ? "Draw" : "Away Win"} | Odds: {bet.odds}
                            </Typography>
                          </div>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveBet(bet.matchId)}
                            className="ml-2"
                            size="small"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <TextField
                    label="Bet Amount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full mb-4"
                    InputProps={{
                      className: "text-white",
                    }}
                  />
                  <Typography className="text-white mb-4">
                    Potential Return: {calculatePotentialReturn()}
                  </Typography>
                  <div className="flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlaceAllBets}
                      className="flex-1"
                    >
                      Place Bet
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancelAllBets}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <Typography className="text-gray-400">
                  No bets added yet.
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
}