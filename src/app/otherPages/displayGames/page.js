"use client";
import { useState, useRef, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";

const initialLeagues = [
  { name: "Premier League", endpoint: "https://v3.football.api-sports.io/leagues?id=39" },
  { name: "La Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=140" },
  { name: "Serie A", endpoint: "https://v3.football.api-sports.io/leagues?id=135" },
  { name: "Bundesliga", endpoint: "https://v3.football.api-sports.io/leagues?id=78" },
  { name: "Ligue 1", endpoint: "https://v3.football.api-sports.io/leagues?id=61" },
  { name: "Eredivisie", endpoint: "https://v3.football.api-sports.io/leagues?id=88" },
  { name: "Primeira Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=94" },
  { name: "MLS", endpoint: "https://v3.football.api-sports.io/leagues?id=253" },
];

export default function BettingPage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(initialLeagues[0].endpoint);
  const [selectedBet, setSelectedBet] = useState({});
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const matchesPerPage = 20;
  const receiptRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchLeagueLogos = async () => {
      const updatedLeagues = await Promise.all(
        initialLeagues.map(async (league) => {
          try {
            const response = await fetch(league.endpoint, {
              method: "GET",
              headers: {
                "x-apisports-key": "aa2a46cd86fefe10bf10a5358b1769a3",
              },
            });
            if (!response.ok) throw new Error("Failed to fetch league data");
            const data = await response.json();
            const logo = data.response[0]?.league?.logo || "";
            return { ...league, logo };
          } catch (error) {
            console.error(`Error fetching logo for ${league.name}:`, error);
            return { ...league, logo: "" };
          }
        })
      );
      setLeagues(updatedLeagues);
    };

    fetchLeagueLogos();
  }, []);

  const generateTransactionId = () => {
    if (typeof window === "undefined") return "";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `txn_${timestamp}_${randomString}`;
  };

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
    setCurrentTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const leagueId = selectedLeague.split("id=")[1];
        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2024&from=2025-03-20&to=2025-10-08`,
          {
            method: "GET",
            headers: {
              "x-apisports-key": "aa2a46cd86fefe10bf10a5358b1769a3",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        setMatches(data.response || []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]);
      }
    };

    fetchMatches();
  }, [selectedLeague]);

  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const generateRandomOdds = () => {
    return (Math.random() * 5 + 1).toFixed(2);
  };

  const handlePlaceBet = (match, betType) => {
    const odds = generateRandomOdds();
    setSelectedBet((prev) => ({ ...prev, [match.fixture.id]: betType }));
    const selectedBet = {
      matchId: match.fixture.id,
      teams: { home: match.teams.home.name, away: match.teams.away.name },
      betType,
      odds: parseFloat(odds),
      date: new Date(match.fixture.date).toLocaleDateString(),
      time: new Date(match.fixture.date).toLocaleTimeString(),
    };
    setBetSlip((prev) => {
      const existingBet = prev.find((bet) => bet.matchId === match.fixture.id);
      if (existingBet) {
        return prev.map((bet) =>
          bet.matchId === match.fixture.id ? selectedBet : bet
        );
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
      setShowReceipt(true);
      setTimeout(() => {
        generateReceiptPDF();
        setBetSlip([]);
        setSelectedBet({});
        setBetAmount("");
        setShowReceipt(false);
      }, 500);
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
  
    html2canvas(receiptElement, {
      useCORS: true,
      logging: true,
      scale: 2,
      windowWidth: receiptElement.scrollWidth,
      windowHeight: receiptElement.scrollHeight,
    })
      .then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10,
          10,
          imgWidth,
          imgHeight
        );
  
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
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

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

  const selectedLeagueName = leagues.find((league) => league.endpoint === selectedLeague)?.name || "";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/images/BundlesBetsLogo.png"
            alt="Bundlesbets Logo"
            className="w-10 h-10"
          />
          <span className="text-xl sm:text-2xl font-bold">Bundlesbets AI Agent</span>
        </div>
        <a href="/otherPages/dashboard" className="text-sm sm:text-lg font-semibold hover:underline">
          <FaHome className="text-2xl" />
        </a>
      </div>

      <Box sx={{ padding: 3, display: "flex", gap: 3, flexDirection: isSmallScreen ? "column" : "row" }}>
        <Box sx={{ flex: 3 }}>
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel id="league-select-label" className="text-white">
              Select League
            </InputLabel>
            <Select
              labelId="league-select-label"
              value={selectedLeague}
              label="Select League"
              onChange={(e) => setSelectedLeague(e.target.value)}
              sx={{
                backgroundColor: "white",
                color: "black",
                "& .MuiSelect-icon": { color: "black" },
              }}
              renderValue={(selected) => {
                const selectedLeagueData = leagues.find((league) => league.endpoint === selected);
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar
                      src={selectedLeagueData?.logo}
                      alt={selectedLeagueData?.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <span style={{ color: "black" }}>{selectedLeagueData?.name}</span>
                  </div>
                );
              }}
            >
              {leagues.map((league) => (
                <MenuItem key={league.endpoint} value={league.endpoint} sx={{ color: "black" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar src={league.logo} alt={league.name} sx={{ width: 24, height: 24 }} />
                    {league.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" className="text-white mb-4">
            {selectedLeagueName} has been selected.
          </Typography>

          {matches.length > 0 ? (
            <TableContainer component={Paper} className="bg-[#1E3A8A] max-h-[600px] overflow-y-auto">
              <Table stickyHeader>
                <TableHead>
                  <TableRow className="bg-[#1E3A8A]">
                    <TableCell className="text-white">Fixture</TableCell>
                    <TableCell className="text-white">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentMatches.map((match) => (
                    <TableRow key={match.fixture.id} className="hover:bg-[#1E3A8A]/90 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <Typography variant="body2" className="text-gray-500 mb-2">
                            {new Date(match.fixture.date).toLocaleDateString()} -{" "}
                            {new Date(match.fixture.date).toLocaleTimeString()}
                          </Typography>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={match.teams.home.logo}
                                alt={match.teams.home.name}
                                sx={{ width: isSmallScreen ? 16 : 24, height: isSmallScreen ? 16 : 24 }}
                              />
                              <Typography className="text-black" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                                {match.teams.home.name}
                              </Typography>
                            </div>
                            <Typography className="text-black">vs</Typography>
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={match.teams.away.logo}
                                alt={match.teams.away.name}
                                sx={{ width: isSmallScreen ? 16 : 24, height: isSmallScreen ? 16 : 24 }}
                              />
                              <Typography className="text-black" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                                {match.teams.away.name}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePlaceBet(match, "home")}
                            className="flex-1"
                            size={isSmallScreen ? "small" : "medium"}
                            startIcon={
                              <Avatar
                                src={match.teams.home.logo}
                                alt={match.teams.home.name}
                                sx={{ width: isSmallScreen ? 12 : 16, height: isSmallScreen ? 12 : 16 }}
                              />
                            }
                          >
                            Win ({generateRandomOdds()})
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handlePlaceBet(match, "draw")}
                            className="flex-1"
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            Draw ({generateRandomOdds()})
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handlePlaceBet(match, "away")}
                            className="flex-1"
                            size={isSmallScreen ? "small" : "medium"}
                            startIcon={
                              <Avatar
                                src={match.teams.away.logo}
                                alt={match.teams.away.name}
                                sx={{ width: isSmallScreen ? 12 : 16, height: isSmallScreen ? 12 : 16 }}
                              />
                            }
                          >
                            Win ({generateRandomOdds()})
                          </Button>
                          <Button
                            variant="outlined"
                            color="info"
                            onClick={() => alert("More Bets clicked!")}
                            className="flex-1"
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            More Bets
                          </Button>
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => alert("Predicted Score clicked!")}
                            className="flex-1"
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            Predicted Score
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography className="text-center text-gray-400">
              No matches available for this league.
            </Typography>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 disabled:bg-gray-500"
            >
              Previous
            </Button>
            <span className="text-lg text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 disabled:bg-gray-500"
            >
              Next
            </Button>
          </div>
        </Box>

        {/* Bet Slip Section */}
        {!isSmallScreen ? (
          <Box sx={{ 
            flex: 1, 
            backgroundColor: "gray.800", 
            padding: 2, 
            borderRadius: 2, 
            border: "1px solid #1E3A8A",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 200px)",
            overflow: "hidden"
          }}>
            <Typography variant="h6" className="text-white mb-4">
              Bet Slip
            </Typography>
            <Box sx={{ 
              flex: 1, 
              overflowY: "auto",
              mb: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#2D3748",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#4A5568",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#718096",
              }
            }}>
              {betSlip.length > 0 ? (
                <div>
                  {betSlip.map((bet) => (
                    <Card key={bet.matchId} className="mb-4 bg-gray-700 border border-[#1E3A8A]">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography className="text-black" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                              {bet.teams.home} vs {bet.teams.away}
                            </Typography>
                            <Typography className="text-black text-sm">
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
                </div>
              ) : (
                <Typography className="text-gray-400 text-center py-4">
                  No bets added yet.
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: "auto" }}>
              <TextField
                label="Bet Amount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full mb-4"
                sx={{
                  backgroundColor: "white",
                  "& .MuiInputBase-input": {
                    color: "black",
                  },
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray",
                    },
                    "&:hover fieldset": {
                      borderColor: "black",
                    },
                  },
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
            </Box>
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
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" className="text-white mb-4">
                  Bet Slip
                </Typography>
                <Box sx={{ 
                  flex: 1,
                  overflowY: "auto",
                  mb: 2,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#2D3748",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#4A5568",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#718096",
                  }
                }}>
                  {betSlip.length > 0 ? (
                    <div>
                      {betSlip.map((bet) => (
                        <Card key={bet.matchId} className="mb-4 bg-gray-700 border border-[#1E3A8A]">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <Typography className="text-black" sx={{ fontSize: "0.875rem" }}>
                                  {bet.teams.home} vs {bet.teams.away}
                                </Typography>
                                <Typography className="text-black text-sm">
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
                    </div>
                  ) : (
                    <Typography className="text-gray-400 text-center py-4">
                      No bets added yet.
                    </Typography>
                  )}
                </Box>
                <Box>
                  <TextField
                    label="Bet Amount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full mb-4"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiInputBase-input": {
                        color: "black",
                      },
                      "& .MuiInputLabel-root": {
                        color: "black",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                      },
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
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Conditionally Render Receipt */}
      {showReceipt && (
        <div ref={receiptRef} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full h-full p-8 bg-white text-black rounded-lg shadow-lg flex flex-col justify-between">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold" style={{ color: "#13dfae" }}>
                Bundlesbets
              </h2>
              <p className="text-lg text-gray-600 mt-2">Betting Receipt</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{currentDate}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{currentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-semibold">{generateTransactionId()}</span>
              </div>
            </div>

            <div className="mb-8 flex-1 overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-4" style={{ color: "#13dfae" }}>
                Bet Details
              </h3>
              {betSlip.map((bet) => (
                <div key={bet.matchId} className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xl font-semibold">
                    {bet.teams.home} vs {bet.teams.away}
                  </p>
                  <p className="text-lg text-gray-600 mt-1">
                    Bet:{" "}
                    {bet.betType === "home"
                      ? "Home Win"
                      : bet.betType === "draw"
                      ? "Draw"
                      : "Away Win"}{" "}
                    | Odds: {bet.odds}
                  </p>
                  <p className="text-lg text-gray-600 mt-1">
                    Date: {bet.date} | Time: {bet.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Bet Amount:</span>
                <span className="font-semibold">${betAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Potential Return:</span>
                <span className="font-semibold">${calculatePotentialReturn()}</span>
              </div>
            </div>

            {qrCodeDataUrl && (
              <div className="text-center mt-8">
                <p className="text-lg text-gray-600 mb-3">
                  Scan the QR code to view your bet details
                </p>
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                Thank you for using Bundlesbets!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For support, contact us at support@bundlesbets.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}