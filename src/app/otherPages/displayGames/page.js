"use client";
import { useState, useEffect } from "react";
import { FaHome, FaChevronLeft, FaChevronRight, FaEllipsisV } from "react-icons/fa";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem as MuiMenuItem,
  useMediaQuery,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  {name:"UEFA champions league", endpoint:"https://v3.football.api-sports.io/leagues?id=2"},
  {name:"Europa League", endpoint:"https://v3.football.api-sports.io/leagues?id=3"},
];

export default function MatchesPage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(initialLeagues[0].endpoint);
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [mobileBetSlipOpen, setMobileBetSlipOpen] = useState(false);
  const matchesPerPage = 10;
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const fetchLeagueLogos = async () => {
      const updatedLeagues = await Promise.all(
        initialLeagues.map(async (league) => {
          try {
            const response = await fetch(league.endpoint, {
              method: "GET",
              headers: {
                "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
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

  const handleMenuOpen = (event, matchId) => {
    setAnchorEl(event.currentTarget);
    setActiveMatch(matchId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMatch(null);
  };

  const selectedLeagueName = leagues.find((league) => league.endpoint === selectedLeague)?.name || "";

  const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const generateRandomOdds = () => {
    return (Math.random() * 5 + 1).toFixed(2);
  };

  const handleAddToBetSlip = (match, betType, odds) => {
    const existingIndex = betSlip.findIndex(bet => bet.matchId === match.fixture.id);
    
    if (existingIndex >= 0) {
      const updatedBetSlip = [...betSlip];
      updatedBetSlip[existingIndex] = {
        matchId: match.fixture.id,
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        betType,
        odds: parseFloat(odds),
        date: formatMatchDate(match.fixture.date),
        time: formatMatchTime(match.fixture.date)
      };
      setBetSlip(updatedBetSlip);
    } else {
      setBetSlip([...betSlip, {
        matchId: match.fixture.id,
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        betType,
        odds: parseFloat(odds),
        date: formatMatchDate(match.fixture.date),
        time: formatMatchTime(match.fixture.date)
      }]);
    }
  };

  const handleRemoveFromBetSlip = (matchId) => {
    setBetSlip(betSlip.filter(bet => bet.matchId !== matchId));
  };

  const calculatePotentialReturn = () => {
    if (!betAmount || isNaN(betAmount) || betAmount <= 0 || betSlip.length === 0) return "0.00";
    
    const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    return (parseFloat(betAmount) * totalOdds).toFixed(2);
  };

  const handlePlaceBet = () => {
    if (betSlip.length === 0 || !betAmount || isNaN(betAmount) || betAmount <= 0) {
      alert("Please add bets to your slip and enter a valid bet amount");
      return;
    }
    
    const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    const potentialReturn = (parseFloat(betAmount) * totalOdds).toFixed(2);
    
    alert(`Bet placed successfully!\n\nStake: $${betAmount}\nPotential Return: $${potentialReturn}`);
    
    setBetSlip([]);
    setBetAmount("");
    setMobileBetSlipOpen(false);
  };

  const handlePredictClick = (match) => {
    alert(`Predicting match: ${match.teams.home.name} vs ${match.teams.away.name}`);
  };

  const handleMoreClick = (match) => {
    alert(`More details for: ${match.teams.home.name} vs ${match.teams.away.name}\n\nDate: ${formatMatchDate(match.fixture.date)}\nTime: ${formatMatchTime(match.fixture.date)}\nVenue: ${match.fixture.venue?.name || 'Unknown'}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 sm:mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/images/BundlesBetsLogo.png"
            alt="Bundlesbets Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-lg sm:text-2xl font-bold">Sports Games</span>
        </div>
        <a href="/otherPages/dashboard" className="text-sm font-semibold hover:underline">
          <FaHome className="text-xl sm:text-2xl" />
        </a>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Matches Column */}
        <div className="w-full flex flex-col">
          {/* League Selector */}
          <div className="mb-4 sm:mb-6">
            <FormControl fullWidth>
              <InputLabel id="league-select-label" className="text-gray-300 text-sm sm:text-base">
                Select League
              </InputLabel>
              <Select
                labelId="league-select-label"
                value={selectedLeague}
                label="Select League"
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="bg-teal-100 text-white rounded-lg"
                sx={{
                  "& .MuiSelect-icon": { color: "white" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
                }}
                renderValue={(selected) => {
                  const selectedLeagueData = leagues.find((league) => league.endpoint === selected);
                  return (
                    <div className="flex items-center gap-2">
                      {selectedLeagueData?.logo && (
                        <img 
                          src={selectedLeagueData.logo} 
                          alt={selectedLeagueData.name} 
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      )}
                      <span className="text-sm sm:text-base">{selectedLeagueData?.name}</span>
                    </div>
                  );
                }}
              >
                {leagues.map((league) => (
                  <MenuItem 
                    key={league.endpoint} 
                    value={league.endpoint}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <div className="flex items-center gap-2">
                      {league.logo && (
                        <img src={league.logo} alt={league.name} className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                      <span className="text-sm sm:text-base">{league.name}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Matches List */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-teal-400 mb-2">
              {selectedLeagueName} Matches
            </h2>
            
            {/* Scrollable matches container */}
            <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {matches.length > 0 ? (
                <div className="grid gap-3 sm:gap-4">
                  {currentMatches.map((match) => {
                    const homeOdds = generateRandomOdds();
                    const drawOdds = generateRandomOdds();
                    const awayOdds = generateRandomOdds();

                    return (
                      <div 
                        key={match.fixture.id} 
                        className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-teal-500 hover:bg-gray-700 transition-colors"
                      >
                        {/* Date and Time */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium text-teal-400">
                              {formatMatchDate(match.fixture.date)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400">
                              {formatMatchTime(match.fixture.date)}
                            </span>
                          </div>
                          
                          {isSmallScreen && (
                            <button 
                              onClick={(e) => handleMenuOpen(e, match.fixture.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <FaEllipsisV />
                            </button>
                          )}
                        </div>
                        
                        {/* Teams and bet buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                          {/* Teams */}
                          <div className="flex-1 flex items-center gap-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <Avatar 
                                src={match.teams.home.logo} 
                                alt={match.teams.home.name}
                                className="w-5 h-5 sm:w-6 sm:h-6"
                              />
                              <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
                                {match.teams.home.name}
                              </span>
                            </div>
                            
                            <span className="mx-1 text-xs sm:text-sm font-bold">vs</span>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
                                {match.teams.away.name}
                              </span>
                              <Avatar 
                                src={match.teams.away.logo} 
                                alt={match.teams.away.name}
                                className="w-5 h-5 sm:w-6 sm:h-6"
                              />
                            </div>
                          </div>

                          {/* Bet buttons */}
                          {!isSmallScreen && (
                            <div className="flex gap-1">
                              <Button 
                                variant="contained" 
                                size="small"
                                color="primary"
                                className="text-xs px-2 py-1 min-w-0"
                                onClick={() => handleAddToBetSlip(match, 'home', homeOdds)}
                                startIcon={<Avatar src={match.teams.home.logo} className="w-3 h-3" />}
                              >
                                {homeOdds}
                              </Button>
                              <Button 
                                variant="contained" 
                                size="small"
                                color="secondary"
                                className="text-xs px-2 py-1 min-w-0"
                                onClick={() => handleAddToBetSlip(match, 'draw', drawOdds)}
                              >
                                {drawOdds}
                              </Button>
                              <Button 
                                variant="contained" 
                                size="small"
                                color="error"
                                className="text-xs px-2 py-1 min-w-0"
                                onClick={() => handleAddToBetSlip(match, 'away', awayOdds)}
                                startIcon={<Avatar src={match.teams.away.logo} className="w-3 h-3" />}
                              >
                                {awayOdds}
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Score and action buttons */}
                        <div className="flex justify-between items-center">
                          {/* Score */}
                          {match.goals.home !== null && match.goals.away !== null && (
                            <div className="inline-flex items-center bg-gray-700 px-2 py-0.5 rounded-full">
                              <span className="text-xs sm:text-sm font-bold">
                                {match.goals.home} - {match.goals.away}
                              </span>
                            </div>
                          )}

                          {/* Predict and More buttons */}
                          {!isSmallScreen && (
                            <div className="flex gap-1 ml-auto">
                              <Button 
                                variant="outlined" 
                                size="small"
                                color="info"
                                className="text-xs px-2 py-1 min-w-0"
                                onClick={() => handlePredictClick(match)}
                              >
                                Predict
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                color="inherit"
                                className="text-xs px-2 py-1 min-w-0"
                                onClick={() => handleMoreClick(match)}
                              >
                                More
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-800 rounded-lg">
                  <Typography variant="h6" className="text-gray-400 text-sm sm:text-base">
                    No matches available for this league
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {matches.length > matchesPerPage && (
            <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-16 sm:mb-0">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <FaChevronLeft className="text-sm sm:text-base" />
                Previous
              </button>
              
              <span className="text-xs sm:text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                Next
                <FaChevronRight className="text-sm sm:text-base" />
              </button>
            </div>
          )}
        </div>

        {/* Bet Slip Column - Only show on larger screens */}
        {!isMediumScreen && (
          <div className="hidden md:block md:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col">
            <h2 className="text-lg font-bold text-teal-400 mb-4">Bet Slip</h2>
            
            {/* Scrollable bet slip container */}
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

            {/* Bet amount and place bet button */}
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
      </div>

      {/* Mobile Bet Slip Button - Fixed at bottom */}
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

      {/* Menu for small screens */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: '#1F2937',
            color: 'white',
          },
        }}
      >
        {activeMatch && matches.find(m => m.fixture.id === activeMatch) && (
          [
            <MuiMenuItem key="home" onClick={(e) => {
              const match = matches.find(m => m.fixture.id === activeMatch);
              handleAddToBetSlip(match, 'home', generateRandomOdds());
              handleMenuClose();
            }}>
              <Button 
                fullWidth
                variant="contained" 
                color="primary"
                size="small"
                className="text-xs"
                startIcon={<Avatar src={matches.find(m => m.fixture.id === activeMatch)?.teams.home.logo} className="w-3 h-3" />}
              >
                Win Home
              </Button>
            </MuiMenuItem>,
            <MuiMenuItem key="draw" onClick={(e) => {
              const match = matches.find(m => m.fixture.id === activeMatch);
              handleAddToBetSlip(match, 'draw', generateRandomOdds());
              handleMenuClose();
            }}>
              <Button 
                fullWidth
                variant="contained" 
                color="secondary"
                size="small"
                className="text-xs"
              >
                Draw
              </Button>
            </MuiMenuItem>,
            <MuiMenuItem key="away" onClick={(e) => {
              const match = matches.find(m => m.fixture.id === activeMatch);
              handleAddToBetSlip(match, 'away', generateRandomOdds());
              handleMenuClose();
            }}>
              <Button 
                fullWidth
                variant="contained" 
                color="error"
                size="small"
                className="text-xs"
                startIcon={<Avatar src={matches.find(m => m.fixture.id === activeMatch)?.teams.away.logo} className="w-3 h-3" />}
              >
                Win Away
              </Button>
            </MuiMenuItem>,
            <MuiMenuItem key="predict" onClick={(e) => {
              const match = matches.find(m => m.fixture.id === activeMatch);
              handlePredictClick(match);
              handleMenuClose();
            }}>
              <Button 
                fullWidth
                variant="outlined" 
                color="info"
                size="small"
                className="text-xs"
              >
                Predict
              </Button>
            </MuiMenuItem>,
            <MuiMenuItem key="more" onClick={(e) => {
              const match = matches.find(m => m.fixture.id === activeMatch);
              handleMoreClick(match);
              handleMenuClose();
            }}>
              <Button 
                fullWidth
                variant="outlined" 
                color="inherit"
                size="small"
                className="text-xs"
              >
                More
              </Button>
            </MuiMenuItem>
          ]
        )}
      </Menu>
    </div>
  );
}