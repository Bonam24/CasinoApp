// components/BetReceipt.js
import { Button } from "@mui/material";

export default function BetReceipt({ bets, betAmount }) {
  const handleDownloadReceipt = () => {
    const receiptContent = `Bet Receipt\n\n${bets
      .map((bet) => `${bet.homeTeam} vs ${bet.awayTeam}`)
      .join("\n")}\n\nTotal Amount: $${betAmount}`;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bet_receipt.txt";
    link.click();
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleDownloadReceipt}>
      Download Receipt
    </Button>
  );
}