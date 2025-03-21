"use client";
import { useState, useRef, useEffect } from "react";
import { FaHome } from "react-icons/fa"; // Import FaHome for the dashboard icon
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import the JSON data
import leaguesData from '@/app/components/mainPage/leagues/leagueFixtures.json'; // Import the leagues data
import SelectLeague from "@/app/components/fixtureDisplay/selectLeague";

export default function BettingPage() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedBet, setSelectedBet] = useState({});
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [matches, setMatches] = useState([]); // Store fetched matches
  const matchesPerPage = 20; // Number of matches to display per page
  const receiptRef = useRef(null);

  // Generate a unique transaction ID (client-side only)
  const generateTransactionId = () => {
    if (typeof window === "undefined") return ""; // Skip on the server
    const timestamp = Date.now(); // Current timestamp
    const randomString = Math.random().toString(36).substring(2, 8); // Random 6-character string
    return `txn_${timestamp}_${randomString}`; // Combine timestamp and random string
  };

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

  // Fetch matches for the selected league
  useEffect(() => {
    if (selectedLeague) {
      const fetchMatches = async () => {
        const league = leaguesData.leagues.find((league) => league.id === selectedLeague);
        if (league) {
          try {
            const response = await fetch(league.endpoint, {
              headers: {
                'x-apisports-key': process.env.NEXT_PUBLIC_SPORTS_API_KEY, // Replace with your API key
              },
            });
            const data = await response.json();
            setMatches(data.response || []); // Set the fetched matches
          } catch (error) {
            console.error("Error fetching matches:", error);
            setMatches([]); // Reset matches if there's an error
          }
        }
      };

      fetchMatches();
    } else {
      setMatches([]); // Reset matches if no league is selected
    }
  }, [selectedLeague]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  // Get the matches for the current page
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const handlePlaceBet = (match, betType) => {
    setSelectedBet((prev) => ({ ...prev, [match.fixture.id]: betType }));
    const selectedBet = {
      matchId: match.fixture.id,
      teams: { home: match.teams.home.name, away: match.teams.away.name },
      betType,
      odds: match.odds[betType],
    };

    setBetSlip((prev) => {
      const existingBet = prev.find((bet) => bet.matchId === match.fixture.id);
      if (existingBet) {
        return prev.map((bet) => (bet.matchId === match.fixture.id ? selectedBet : bet));
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

  const handlePlaceAllBets = async () => {
    if (betSlip.length === 0 || !betAmount) {
      alert("Please add bets and enter a bet amount.");
      return;
    }

    // Generate a unique transaction ID (client-side only)
    const transactionId = generateTransactionId();

    // Save the bet slip data to a server (mock implementation)
    const betData = {
      transactionId,
      bets: betSlip,
      betAmount,
      potentialReturn: calculatePotentialReturn(),
    };

    // Simulate saving to a server
    console.log("Saving bet data to server:", betData);

    // Generate QR code data with only the transaction ID
    const qrCodeData = transactionId; // Only the transaction ID is encoded

    QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      setQrCodeDataUrl(url);

      // Add a small delay to ensure the QR code is rendered
      setTimeout(() => {
        generateReceiptPDF();

        // Clear the bet slip and reset states after generating the PDF
        setBetSlip([]);
        setSelectedBet({});
        setBetAmount("");
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

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if content exceeds one page
      if (imgHeight > 280) { // Approximate height of an A4 page in mm
        // Reduce the size of the content to fit on one page
        const scaleFactor = 280 / imgHeight;
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10, // x position
          10, // y position
          imgWidth * scaleFactor,
          imgHeight * scaleFactor
        );
      } else {
        // Add the content to the PDF as is
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10, // x position
          10, // y position
          imgWidth,
          imgHeight
        );
      }

      // Add the QR code at the bottom of the page
      if (qrCodeDataUrl) {
        const qrCodeHeight = 50; // Height of the QR code in mm
        const qrCodeWidth = 50; // Width of the QR code in mm
        const qrCodeX = (pdf.internal.pageSize.width - qrCodeWidth) / 2; // Center the QR code horizontally
        const qrCodeY = pdf.internal.pageSize.height - qrCodeHeight - 20; // Position the QR code at the bottom

        pdf.setFontSize(12); // Reduce font size for QR code label
        pdf.text("Scan QR Code for Bet Details", qrCodeX, qrCodeY - 10); // Add label above the QR code
        pdf.addImage(qrCodeDataUrl, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight); // Add the QR code
      }

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

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/images/BundlesBetsLogo.png"
            alt="Bundlesbets Logo"
            className="w-10 h-10"
          />
          <span className="text-xl sm:text-2xl font-bold">Bundlesbets AI Agent</span>
        </div>
        {/* Replace "Dashboard" text with a dashboard icon */}
        <a
          href="/otherPages/dashboard"
          className="text-sm sm:text-lg font-semibold hover:underline"
        >
          <FaHome className="text-2xl" /> {/* Dashboard icon */}
        </a>
      </div>

      {/* League Selector */}
      <SelectLeague onSelectLeague={setSelectedLeague} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Matches List */}
        <div className="flex-1 overflow-y-auto max-h-[65vh]">
          {currentMatches.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Match</th>
                </tr>
              </thead>
              <tbody>
                {currentMatches.map((match) => (
                  <tr key={match.fixture.id} className="border-b border-gray-700">
                    <td className="p-2">
                      {new Date(match.fixture.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="p-2">
                      {match.teams.home.name} vs {match.teams.away.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400">No matches available for this league.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-500"
            >
              Previous
            </button>
            <span className="text-lg text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-500"
            >
              Next
            </button>
          </div>
        </div>

        {/* Bet Slip */}
        <div
          className={`fixed lg:relative w-full lg:w-96 bg-gray-800 p-4 rounded-lg shadow-lg h-auto ${
            showBetSlip ? 'block' : 'hidden'
          } lg:block`}
          style={{
            top: showBetSlip ? '50%' : 'auto',
            left: showBetSlip ? '50%' : 'auto',
            transform: showBetSlip ? 'translate(-50%, -50%)' : 'none',
            zIndex: showBetSlip ? 1000 : 'auto',
          }}
        >
          <h2 className="text-xl font-bold text-teal-400 mb-4">Your Bet Slip</h2>
          <div className="flex-1 overflow-y-auto max-h-[60vh]">
            {betSlip.length > 0 ? (
              betSlip.map((bet, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 mb-3 rounded-lg bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {bet.teams.home} vs {bet.teams.away}
                    </span>
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
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceAllBets}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm"
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

      {/* Floating Button for Small Screens */}
      <button
        onClick={() => setShowBetSlip(!showBetSlip)}
        className="fixed bottom-4 right-4 p-4 bg-teal-500 text-white rounded-full shadow-lg lg:hidden"
      >
        {showBetSlip ? "Hide Bet Slip" : "Show Bet Slip"}
      </button>

      {/* Receipt (Hidden) */}
      <div ref={receiptRef} className="absolute -left-[9999px]">
        <div className="p-6 bg-white text-black rounded-lg shadow-lg relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-6xl font-bold text-gray-300 rotate-45">Bundlesbets</span>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold text-center mb-4 text-teal-500">Bundlesbets Receipt</h1>
            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-lg text-gray-600">Date: {currentDate}</p>
              <p className="text-lg text-gray-600">Time: {currentTime}</p>
              <p className="text-lg text-gray-600">Transaction ID: {generateTransactionId()}</p> {/* Display the transaction ID */}
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-teal-500">Bets</h2>
              {betSlip.map((bet, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <p className="text-lg">
                    <span
                      style={{
                        color: bet.betType === "home" ? "green" : "black",
                      }}
                    >
                      {bet.teams.home}
                    </span>{" "}
                    vs{" "}
                    <span
                      style={{
                        color: bet.betType === "away" ? "green" : "black",
                      }}
                    >
                      {bet.teams.away}
                    </span>
                  </p>
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
                <>
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-32 h-32"
                    onLoad={() => {
                      console.log("QR code loaded successfully.");
                    }}
                  />
                  <p className="text-lg text-gray-600 mt-2">
                    Scan the QR code to view your bet details.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}