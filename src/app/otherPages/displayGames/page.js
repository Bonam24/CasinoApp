
"use client";
import { useState, useEffect } from "react";
import { sportsData } from "@/app/components/displayFixtures/data/sportsData";
import BetSlip from "@/app/components/displayFixtures/betSlip";
import { useMediaQuery } from "@mui/material";
import { formatMatchTime, formatMatchDate } from "@/app/utils/Date/dateUtils";

// Import all the new components
import { Header } from "@/app/components/displayFixtures/header";
import { SportLeagueSelectors } from "@/app/components/displayFixtures/sportsLeagueSelector";
import { MatchesList } from "@/app/components/displayFixtures/matchesList";
import { PaginationControls } from "@/app/components/displayFixtures/paginationControls";
import { MoreOddsDialog } from "@/app/components/displayFixtures/moreOptionsDialog";
import { PredictionsDialog } from "@/app/components/displayFixtures/predictionsDialog";
import { BetSlipButton } from "@/app/components/displayFixtures/betSlipButton";

export default function MatchesPage() {
  // State management
  const [selectedSport, setSelectedSport] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [oddsData, setOddsData] = useState({});
  const [loadingOdds, setLoadingOdds] = useState({});
  const [betSlip, setBetSlip] = useState([]);
  const [betAmount, setBetAmount] = useState("");
  const [mobileBetSlipOpen, setMobileBetSlipOpen] = useState(false);
  const [moreOddsOpen, setMoreOddsOpen] = useState(false);
  const [selectedMatchForMoreOdds, setSelectedMatchForMoreOdds] = useState(null);
  const [predictionsOpen, setPredictionsOpen] = useState(false);
  const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
  const [predictionsData, setPredictionsData] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:900px)");

  // Calculate pagination variables
  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  // Fetch league logos when sport is selected
  useEffect(() => {
    if (selectedSport) {
      const fetchLeagueLogos = async () => {
        const updatedLeagues = await Promise.all(
          selectedSport.leagues.map(async (league) => {
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
    }
  }, [selectedSport]);

  // Fetch matches when league is selected
  useEffect(() => {
    if (!selectedLeague) return;

    const fetchData = async () => {
      try {
        const leagueId = selectedLeague.split("id=")[1];
        const matchesResponse = await fetch(
          `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2024`,
          {
            headers: {
              "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
            },
          }
        );

        if (!matchesResponse.ok) throw new Error("Failed to fetch matches");
        const matchesData = await matchesResponse.json();

        const activeMatches = (matchesData.response || []).filter(
          match => match.fixture.status.short !== "FT" && 
                  match.fixture.status.long !== "Match Finished"
        );

        const sortedMatches = activeMatches.sort((a, b) => {
          return new Date(a.fixture.date) - new Date(b.fixture.date);
        });

        setMatches(sortedMatches);
        setCurrentPage(1);

        setOddsData(prev => ({
          ...prev,
          ...Object.fromEntries(sortedMatches.map(match => [match.fixture.id, null]))
        }));
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    fetchData();
  }, [selectedLeague]);

  // Fetch odds for current page matches
  useEffect(() => {
    if (matches.length === 0) return;

    const fetchCurrentPageOdds = async () => {
      const currentPageMatchIds = currentMatches.map(match => match.fixture.id);
      
      setLoadingOdds(prev => ({
        ...prev,
        ...Object.fromEntries(currentPageMatchIds.map(id => [id, true]))
      }));
      
      const oddsPromises = currentMatches.map(async match => {
        try {
          const response = await fetch(
            `https://v3.football.api-sports.io/odds?fixture=${match.fixture.id}`,
            {
              headers: {
                "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
              },
            }
          );
          
          if (!response.ok) throw new Error("Failed to fetch odds");
          const data = await response.json();
          
          return {
            matchId: match.fixture.id,
            odds: data.response?.[0] || null
          };
        } catch (error) {
          console.error(`Error fetching odds for match ${match.fixture.id}:`, error);
          return {
            matchId: match.fixture.id,
            odds: null
          };
        }
      });

      const results = await Promise.all(oddsPromises);
      
      setOddsData(prev => ({
        ...prev,
        ...Object.fromEntries(results.map(result => [result.matchId, result.odds]))
      }));
      
      setLoadingOdds(prev => {
        const newState = {...prev};
        currentPageMatchIds.forEach(id => delete newState[id]);
        return newState;
      });
    };

    fetchCurrentPageOdds();
  }, [currentPage, matches]);

  // Fetch predictions for a match
  const fetchPredictions = async (fixtureId) => {
    setLoadingPredictions(true);
    try {
      const response = await fetch(
        `https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`,
        {
          method: "GET",
          headers: {
            "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch predictions");
      const data = await response.json();
      setPredictionsData(data.response?.[0] || null);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictionsData(null);
    } finally {
      setLoadingPredictions(false);
    }
  };

  // Pagination handlers
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

  // Sport and league selection handlers
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedLeague(null);
    setMatches([]);
    setOddsData({});
  };

  const handleLeagueSelect = (leagueEndpoint) => {
    setSelectedLeague(leagueEndpoint);
  };

  // Bet slip management
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

  const handlePlaceBet = () => {
    if (betSlip.length === 0 || !betAmount || isNaN(betAmount)) {
      alert("Please add bets to your slip and enter a valid bet amount");
      return;
    }
    
    const amount = parseFloat(betAmount);
    if (amount <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }
    
    const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    const potentialReturn = (amount * totalOdds).toFixed(2);
    
    alert(`Bet placed successfully!\n\nStake: $${amount}\nPotential Return: $${potentialReturn}`);
    
    setBetSlip([]);
    setBetAmount("");
    setMobileBetSlipOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 flex flex-col">
      <Header />
      
      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="w-full flex flex-col">
          <SportLeagueSelectors 
            sportsData={sportsData}
            selectedSport={selectedSport}
            leagues={leagues}
            selectedLeague={selectedLeague}
            handleSportSelect={(sportName) => {
              const sport = sportsData.find(s => s.name === sportName);
              handleSportSelect(sport);
            }}
            handleLeagueSelect={handleLeagueSelect}
          />

          <MatchesList
            selectedLeague={selectedLeague}
            leagues={leagues}
            matches={matches}
            currentMatches={currentMatches}
            oddsData={oddsData}
            loadingOdds={loadingOdds}
            handleAddToBetSlip={handleAddToBetSlip}
            setSelectedMatchForPredictions={setSelectedMatchForPredictions}
            fetchPredictions={fetchPredictions}
            setPredictionsOpen={setPredictionsOpen}
            setSelectedMatchForMoreOdds={setSelectedMatchForMoreOdds}
            setMoreOddsOpen={setMoreOddsOpen}
            isSmallScreen={isSmallScreen}
          />

          <PaginationControls
            matches={matches}
            matchesPerPage={matchesPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
        </div>

        {!isMediumScreen && (
          <BetSlip 
            bets={betSlip}
            onRemoveBet={handleRemoveFromBetSlip}
            onPlaceBet={handlePlaceBet}
            betAmount={betAmount}
            onBetAmountChange={setBetAmount}
          />
        )}
      </div>

      <BetSlipButton
        isMediumScreen={isMediumScreen}
        betSlip={betSlip}
        setMobileBetSlipOpen={setMobileBetSlipOpen}
      />

      <MoreOddsDialog
        moreOddsOpen={moreOddsOpen}
        setMoreOddsOpen={setMoreOddsOpen}
        selectedMatchForMoreOdds={selectedMatchForMoreOdds}
        oddsData={oddsData}
        handleAddToBetSlip={handleAddToBetSlip}
        formatMatchDate={formatMatchDate}
        formatMatchTime={formatMatchTime}
      />

      <PredictionsDialog
        predictionsOpen={predictionsOpen}
        setPredictionsOpen={setPredictionsOpen}
        loadingPredictions={loadingPredictions}
        predictionsData={predictionsData}
        selectedMatchForPredictions={selectedMatchForPredictions}
        formatMatchDate={formatMatchDate}
        formatMatchTime={formatMatchTime}
      />

      <BetSlip
        isMobile={true}
        open={mobileBetSlipOpen}
        onClose={() => setMobileBetSlipOpen(false)}
        bets={betSlip}
        onRemoveBet={handleRemoveFromBetSlip}
        onPlaceBet={handlePlaceBet}
        betAmount={betAmount}
        onBetAmountChange={setBetAmount}
      />
    </div>
  );
}

