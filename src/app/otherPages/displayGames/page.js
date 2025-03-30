

"use client";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { 
  Typography,
  Menu,
  MenuItem as MuiMenuItem,
  useMediaQuery
} from "@mui/material";
import { sportsData, matchesPerPage } from "@/app/components/displayGames/sportsData";
import Header from "@/app/components/displayGames/headerForGames";
import SportLeagueSelectors from "@/app/components/displayGames/sportLeagueSelector";
import MatchCard from "@/app/components/displayGames/matchCard";
import BetSlip from "@/app/components/displayGames/betSlip";
import MoreOddsDialog from "@/app/components/displayGames/moreOddsDialog";
import PredictionsDialog from "@/app/components/displayGames/predictionsDialog";

export default function MatchesPage() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]);
  const [oddsData, setOddsData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [mobileBetSlipOpen, setMobileBetSlipOpen] = useState(false);
  const [moreOddsOpen, setMoreOddsOpen] = useState(false);
  const [selectedMatchForMoreOdds, setSelectedMatchForMoreOdds] = useState(null);
  const [predictionsOpen, setPredictionsOpen] = useState(false);
  const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
  const [predictionsData, setPredictionsData] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:900px)");

  // Calculate pagination variables
  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  useEffect(() => {
    if (selectedLeague) {
      const fetchMatchesAndOdds = async () => {
  try {
    // Fetch matches
    const leagueId = selectedLeague.split("id=")[1];
    const matchesResponse = await fetch(
      `/api/fetchGames/matches?league=${leagueId}&season=2024&from=2025-03-20&to=2025-10-08`
    );
    
    if (!matchesResponse.ok) {
      throw new Error("Failed to fetch matches");
    }
    
    const matchesData = await matchesResponse.json();
    setMatches(matchesData.response || []);
    
    // Fetch odds for the league
    const leagueData = sportsData
      .flatMap(sport => sport.leagues)
      .find(league => league.endpoint === selectedLeague);
    
    if (leagueData?.oddsEndpoint) {
      try {
        const oddsResponse = await fetch(
          `/api/fetchGames/odds?endpoint=${encodeURIComponent(leagueData.oddsEndpoint)}`
        );
        
        if (!oddsResponse.ok) {
          const errorData = await oddsResponse.json();
          console.error("Odds API Error:", errorData);
          throw new Error("Failed to fetch odds data");
        }
        
        const oddsData = await oddsResponse.json();
        
        // Organize odds data by fixture ID
        const oddsByFixture = {};
        oddsData.response?.forEach?.(item => {
          oddsByFixture[item.fixture.id] = item;
        });
        setOddsData(oddsByFixture);
      } catch (oddsError) {
        console.error("Error fetching odds:", oddsError);
        // Continue without odds data rather than failing completely
        setOddsData({});
      }
    }
    
    setCurrentPage(1);
  } catch (error) {
    console.error("Error fetching data:", error);
    setMatches([]);
    setOddsData({});
  }
};

      fetchMatchesAndOdds();
    }
  }, [selectedLeague]);

  const getMatchOdds = (matchId) => {
    const odds = oddsData[matchId];
    if (!odds) return null;
    
    const bookmaker = odds.bookmakers?.[0];
    if (!bookmaker) return null;
    
    const matchWinnerBet = bookmaker.bets.find(bet => bet.id === 1);
    if (!matchWinnerBet) return null;
    
    const homeOdd = matchWinnerBet.values.find(v => v.value === "Home")?.odd;
    const drawOdd = matchWinnerBet.values.find(v => v.value === "Draw")?.odd;
    const awayOdd = matchWinnerBet.values.find(v => v.value === "Away")?.odd;
    
    return {
      home: homeOdd,
      draw: drawOdd,
      away: awayOdd
    };
  };

  const fetchPredictions = async (fixtureId) => {
    setLoadingPredictions(true);
    try {
      console.log("[DEBUG] Fetching predictions for fixture:", fixtureId);
      const response = await fetch(
        `/api/fetchGames/predictions?fixture=${fixtureId}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("[ERROR] Predictions API Error:", errorData);
        throw new Error("Failed to fetch predictions");
      }
      
      const data = await response.json();
      console.log("[DEBUG] Predictions data received:", data);
      setPredictionsData(data.response?.[0] || null);
    } catch (error) {
      console.error("[ERROR] in fetchPredictions:", error);
      setPredictionsData(null);
    } finally {
      setLoadingPredictions(false);
    }
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

  const handleMenuOpen = (event, matchId) => {
    setAnchorEl(event.currentTarget);
    setActiveMatch(matchId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMatch(null);
  };

  const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleAddToBetSlip = (match, betType, odds) => {
    if (!odds) return;
    
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
    setSelectedMatchForPredictions(match);
    fetchPredictions(match.fixture.id);
    setPredictionsOpen(true);
  };

  const handleMoreClick = (match) => {
    setSelectedMatchForMoreOdds(match);
    setMoreOddsOpen(true);
  };

  const getMoreOddsOptions = (matchId) => {
    const odds = oddsData[matchId];
    if (!odds) return [];
    
    const bookmaker = odds.bookmakers?.[0];
    if (!bookmaker) return [];
    
    return bookmaker.bets.filter(bet => bet.id !== 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Matches Column */}
        <div className="w-full flex flex-col">
          <SportLeagueSelectors 
            sportsData={sportsData}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedLeague={selectedLeague}
            setSelectedLeague={setSelectedLeague}
            setMatches={setMatches}
            setOddsData={setOddsData}
          />

          {/* Matches List */}
          {selectedLeague ? (
            <div className="flex-1 flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold text-teal-400 mb-2">
                {sportsData
                  .flatMap(sport => sport.leagues)
                  .find(league => league.endpoint === selectedLeague)?.name} Matches
              </h2>
              
              {/* Scrollable matches container */}
              <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {matches.length > 0 ? (
                  <div className="grid gap-3 sm:gap-4">
                    {currentMatches.map((match) => (
                      <MatchCard
                        key={match.fixture.id}
                        match={match}
                        odds={getMatchOdds(match.fixture.id)}
                        isSmallScreen={isSmallScreen}
                        handleAddToBetSlip={handleAddToBetSlip}
                        handleMenuOpen={handleMenuOpen}
                        handlePredictClick={handlePredictClick}
                        handleMoreClick={handleMoreClick}
                        formatMatchDate={formatMatchDate}
                        formatMatchTime={formatMatchTime}
                      />
                    ))}
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
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg">
              {selectedSport ? (
                <Typography variant="h6" className="text-gray-400 text-center">
                  Please select a league to view matches
                </Typography>
              ) : (
                <Typography variant="h6" className="text-gray-400 text-center">
                  Please select a sport to begin
                </Typography>
              )}
            </div>
          )}

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

        <BetSlip
          betSlip={betSlip}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          handleRemoveFromBetSlip={handleRemoveFromBetSlip}
          calculatePotentialReturn={calculatePotentialReturn}
          handlePlaceBet={handlePlaceBet}
          isMediumScreen={isMediumScreen}
          mobileBetSlipOpen={mobileBetSlipOpen}
          setMobileBetSlipOpen={setMobileBetSlipOpen}
        />
      </div>

      <MoreOddsDialog
        moreOddsOpen={moreOddsOpen}
        setMoreOddsOpen={setMoreOddsOpen}
        selectedMatchForMoreOdds={selectedMatchForMoreOdds}
        getMoreOddsOptions={getMoreOddsOptions}
        handleAddToBetSlip={handleAddToBetSlip}
        formatMatchDate={formatMatchDate}
        formatMatchTime={formatMatchTime}
      />

      <PredictionsDialog
        predictionsOpen={predictionsOpen}
        setPredictionsOpen={setPredictionsOpen}
        selectedMatchForPredictions={selectedMatchForPredictions}
        predictionsData={predictionsData}
        loadingPredictions={loadingPredictions}
        formatMatchDate={formatMatchDate}
        formatMatchTime={formatMatchTime}
      />

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
          (() => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            const odds = getMatchOdds(activeMatch);
            
            return [
              <MuiMenuItem key="home" onClick={(e) => {
                handleAddToBetSlip(match, 'home', odds?.home);
                handleMenuClose();
              }}
              disabled={!odds?.home}>
                <Button 
                  fullWidth
                  variant="contained" 
                  color="primary"
                  size="small"
                  className="text-xs"
                  startIcon={<Avatar src={match?.teams.home.logo} className="w-3 h-3" />}
                >
                  Win Home @ {odds?.home || "N/A"}
                </Button>
              </MuiMenuItem>,
              <MuiMenuItem key="draw" onClick={(e) => {
                handleAddToBetSlip(match, 'draw', odds?.draw);
                handleMenuClose();
              }}
              disabled={!odds?.draw}>
                <Button 
                  fullWidth
                  variant="contained" 
                  color="secondary"
                  size="small"
                  className="text-xs"
                >
                  Draw @ {odds?.draw || "N/A"}
                </Button>
              </MuiMenuItem>,
              <MuiMenuItem key="away" onClick={(e) => {
                handleAddToBetSlip(match, 'away', odds?.away);
                handleMenuClose();
              }}
              disabled={!odds?.away}>
                <Button 
                  fullWidth
                  variant="contained" 
                  color="error"
                  size="small"
                  className="text-xs"
                  startIcon={<Avatar src={match?.teams.away.logo} className="w-3 h-3" />}
                >
                  Win Away @ {odds?.away || "N/A"}
                </Button>
              </MuiMenuItem>,
              <MuiMenuItem key="predict" onClick={(e) => {
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
          })()
        )}
      </Menu>
    </div>
  );
}