import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Receipt({ betSlip, betAmount, calculatePotentialReturn, qrCodeDataUrl, setQrCodeDataUrl }) {
  const receiptRef = useRef(null);

  const generateTransactionId = () => {
    if (typeof window === "undefined") return "";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `txn_${timestamp}_${randomString}`;
  };

  const handlePlaceAllBets = async () => {
    if (betSlip.length === 0 || !betAmount) {
      alert("Please add bets and enter a bet amount.");
      return;
    }

    const transactionId = generateTransactionId();
    const betData = {
      transactionId,
      bets: betSlip,
      betAmount,
      potentialReturn: calculatePotentialReturn(),
    };

    console.log("Saving bet data to server:", betData);

    const qrCodeData = transactionId;
    QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: "H" }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      setQrCodeDataUrl(url);
      setTimeout(() => {
        generateReceiptPDF();
      }, 500);
    });
  };

  const generateReceiptPDF = () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) {
      console.error("Receipt element not found.");
      return;
    }

    receiptElement.classList.remove("invisible");

    html2canvas(receiptElement, {
      useCORS: true,
      logging: true,
    })
      .then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > 280) {
          const scaleFactor = 280 / imgHeight;
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            10,
            10,
            imgWidth * scaleFactor,
            imgHeight * scaleFactor
          );
        } else {
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            10,
            10,
            imgWidth,
            imgHeight
          );
        }

        if (qrCodeDataUrl) {
          const qrCodeHeight = 50;
          const qrCodeWidth = 50;
          const qrCodeX = (pdf.internal.pageSize.width - qrCodeWidth) / 2;
          const qrCodeY = pdf.internal.pageSize.height - qrCodeHeight - 20;

          pdf.setFontSize(12);
          pdf.text("Scan QR Code for Bet Details", qrCodeX, qrCodeY - 10);
          pdf.addImage(
            qrCodeDataUrl,
            "PNG",
            qrCodeX,
            qrCodeY,
            qrCodeWidth,
            qrCodeHeight
          );
        }

        pdf.save("betting_receipt.pdf");
        receiptElement.classList.add("invisible");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        receiptElement.classList.add("invisible");
      });
  };

  return (
    <div ref={receiptRef} className="invisible">
      <div className="p-4 bg-white text-black">
        <h2 className="text-xl font-bold">Betting Receipt</h2>
        <div className="mt-4">
          {betSlip.map((bet) => (
            <div key={bet.matchId} className="mb-4">
              <p className="text-lg">{bet.teams.home} vs {bet.teams.away}</p>
              <p className="text-sm">Bet: {bet.betType === "home" ? "Home Win" : bet.betType === "draw" ? "Draw" : "Away Win"} | Odds: {bet.odds}</p>
            </div>
          ))}
        </div>
        <p className="text-lg">Bet Amount: {betAmount}</p>
        <p className="text-lg">Potential Return: {calculatePotentialReturn()}</p>
      </div>
    </div>
  );
}