"use client";

import { useState, useRef, useEffect } from "react";
import { FaBasketballBall } from "react-icons/fa";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import the JSON data
import matchesData from './matchesData.json';

const leagues = [
  { id: "nba", name: "NBA", icon: <FaBasketballBall className="text-yellow-400 text-4xl" /> },
];

export default function BettingPage() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedBet, setSelectedBet] = useState({});
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const receiptRef = useRef(null);

  // Set current date and time on client side
  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    );
    setCurrentTime(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    );
  }, []);

  const filteredMatches = selectedLeague
    ? matchesData.filter((match) => match.league === selectedLeague)
    : matchesData;

  const handlePlaceBet = (match, betType) => {
    setSelectedBet((prev) => ({ ...prev, [match.id]: betType }));
    const selectedBet = {
      matchId: match.id,
      teams: { home: match.team1.name, away: match.team2.name },
      betType,
      odds: match.odds[betType],
    };

    setBetSlip((prev) => {
      const existingBet = prev.find((bet) => bet.matchId === match.id);
      if (existingBet) {
        return prev.map((bet) => (bet.matchId === match.id ? selectedBet : bet));
      }
      return [...prev, selectedBet];
    });
  };

  const handleRemoveBet = (matchId) => {
    setBetSlip((prev) => prev.filter((bet) => bet.matchId !== matchId));
    setSelectedBet((prev) => {
      const updatedSelectedBet = { ...prev };
      delete updatedSelectedBet[matchId];
      return updatedSelectedBet;
    });
  };

  const handleCancelAllBets = () => {
    setBetSlip([]);
    setSelectedBet({});
    setBetAmount("");
    setQrCodeDataUrl("");
  };

  const handlePlaceAllBets = () => {
    if (betSlip.length === 0 || !betAmount) {
      alert("Please add bets and enter a bet amount.");
      return;
    }

    // Generate QR code data
    const qrCodeData = JSON.stringify({
      bets: betSlip,
      betAmount,
      potentialReturn: calculatePotentialReturn(),
    });

    QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      setQrCodeDataUrl(url);

      // Add a small delay to ensure the QR code is rendered
      setTimeout(() => {
        generateReceiptPDF();
      }, 500); // 500ms delay
    });
  };

  const calculatePotentialReturn = () => {
    if (betSlip.length === 0 || !betAmount) return 0;
    const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    return betAmount * totalOdds;
  };

  const generateReceiptPDF = () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) {
      console.error("Receipt element not found.");
      return;
    }

    // Make the receipt element visible
    receiptElement.classList.remove("invisible");

    console.log("Generating PDF...");

    html2canvas(receiptElement, {
      useCORS: true,
      logging: true,
    }).then((canvas) => {
      console.log("Canvas created successfully.");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("betting_receipt.pdf");
      console.log("PDF saved successfully.");

      // Hide the receipt element again
      receiptElement.classList.add("invisible");
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      // Hide the receipt element in case of error
      receiptElement.classList.add("invisible");
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center">
        {/* Left Side: Logo and Text */}
        <div className="flex items-center gap-3">
          <img
            src="/images/BundlesBetsLogo.png" // Replace with your logo path
            alt="Bundlesbets Logo"
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold">Bundlesbets AI Agent</span>
        </div>

        {/* Right Side: Dashboard Link */}
        <a
          href="/dashboard" // Replace with your dashboard route
          className="text-lg font-semibold hover:underline"
        >
          Back to Dashboard
        </a>
      </div>

      {/* League Selector in Header */}
      <div className="flex justify-center gap-6 mb-6">
        {leagues.map((league) => (
          <button
            key={league.id}
            className={`p-3 rounded-full transition ${
              selectedLeague === league.id ? "bg-teal-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedLeague(selectedLeague === league.id ? null : league.id)}
          >
            {league.icon}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex gap-6 flex-1">
        <div className="flex-1">
          {/* Matches List */}
          <div className="overflow-y-auto max-h-[65vh]">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className={`p-4 rounded-lg mb-4 shadow-lg transition-all duration-200 ${
                    selectedBet[match.id] ? "bg-teal-900" : "bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                    <span className="text-xs text-gray-400">
                      {new Date(match.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })} | {new Date(match.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-4">
                    {/* Match Details */}
                    <div className="col-span-4 flex items-center gap-2">
                      <img src={match.team1.logo} alt={match.team1.name} className="w-10 h-10" />
                      <h2 className="text-sm font-semibold">{match.team1.name} vs {match.team2.name}</h2>
                      <img src={match.team2.logo} alt={match.team2.name} className="w-10 h-10" />
                    </div>

                    {/* Betting Odds */}
                    <div className="col-span-5 flex justify-around">
                      {Object.entries(match.odds).map(([type, odd]) => (
                        <button
                          key={type}
                          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                            selectedBet[match.id] === type
                              ? "bg-teal-500 text-white"
                              : "bg-gray-700 hover:bg-teal-400 hover:text-black"
                          }`}
                          onClick={() => handlePlaceBet(match, type)}
                        >
                          {type === "team1" ? match.team1.name : type === "team2" ? match.team2.name : "Draw"} <br />
                          <span className="text-lg font-bold">{odd}</span>
                        </button>
                      ))}
                    </div>

                    {/* AI Prediction & More Bets Buttons */}
                    <div className="col-span-3 flex gap-2">
                      <button className="px-4 py-2 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg">
                        AI Prediction
                      </button>
                      <button className="px-4 py-2 text-xs bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg">
                        More Bets
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No matches available for this league.</p>
            )}
          </div>
        </div>

        {/* Bet Slip */}
        <div className="w-96 bg-gray-800 p-4 rounded-lg shadow-lg h-auto">
          <h2 className="text-xl font-bold text-teal-400 mb-4">Your Bet Slip</h2>
          <div className="flex-1">
            {betSlip.length > 0 ? (
              betSlip.map((bet, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 mb-3 rounded-lg bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{bet.teams.home} vs {bet.teams.away}</span>
                  </div>
                  <span className="text-sm font-bold">{bet.odds}</span>
                  <button
                    onClick={() => handleRemoveBet(bet.matchId)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No bets selected.</p>
            )}
          </div>

          {/* Bet Amount Input and Buttons */}
          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={handleCancelAllBets}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceAllBets}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Place Bet
              </button>
            </div>
          </div>

          {/* Potential Return */}
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Your potential return is:{" "}
              <span className="font-bold text-teal-400">
                ${calculatePotentialReturn().toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Receipt (Hidden) */}
      <div ref={receiptRef} className="invisible">
        <div className="p-6 bg-white text-black rounded-lg shadow-lg relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-6xl font-bold text-gray-300 rotate-45">Bundlesbets</span>
          </div>

          {/* Receipt Content */}
          <div className="relative">
            <h1 className="text-3xl font-bold text-center mb-4 text-teal-500">Bundlesbets Receipt</h1>
            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-lg text-gray-600">Date: {currentDate}</p>
              <p className="text-lg text-gray-600">Time: {currentTime}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-teal-500">Bets</h2>
              {betSlip.map((bet, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <p className="text-lg">{bet.teams.home} vs {bet.teams.away}</p>
                  <p className="text-lg font-bold">Odds: {bet.odds}</p>
                </div>
              ))}
            </div>
            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-lg">Bet Amount: ${betAmount}</p>
              <p className="text-lg">Potential Return: ${calculatePotentialReturn().toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center">
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-32 h-32"
                  onLoad={() => {
                    console.log("QR code loaded successfully.");
                  }}
                />
              )}
              <p className="text-lg text-gray-600 mt-2">Thank you for playing with Bundlesbets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}