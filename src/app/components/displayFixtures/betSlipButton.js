"use client";
import { Button as MuiButton } from "@mui/material";

export const BetSlipButton = ({ 
  isMediumScreen, 
  betSlip, 
  setMobileBetSlipOpen 
}) => (
  isMediumScreen && betSlip.length > 0 && (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 border-t border-gray-700 z-10">
      <MuiButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setMobileBetSlipOpen(true)}
        className="bg-teal-600 hover:bg-teal-700"
      >
        View Bet Slip ({betSlip.length})
      </MuiButton>
    </div>
  )
);