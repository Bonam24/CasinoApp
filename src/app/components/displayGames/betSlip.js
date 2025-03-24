// components/BetSlip.js
import { useState } from "react";
import { Button, TextField, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function BetSlip({ bets, onPlaceBet }) {
  const [betAmount, setBetAmount] = useState("");

  const handlePlaceBet = () => {
    if (betAmount && bets.length > 0) {
      onPlaceBet(betAmount);
      setBetAmount("");
    }
  };

  return (
    <div>
      <Typography variant="h6">Your Bet Slip</Typography>
      <List>
        {bets.map((bet, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${bet.homeTeam} vs ${bet.awayTeam}`} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Bet Amount"
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handlePlaceBet}>
        Place Bet
      </Button>
    </div>
  );
}