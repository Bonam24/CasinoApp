

// "use client";
// import { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { 
//   Typography,
//   Menu,
//   MenuItem as MuiMenuItem,
//   useMediaQuery
// } from "@mui/material";
// import { sportsData, matchesPerPage } from "@/app/components/displayGames/sportsData";
// import Header from "@/app/components/displayGames/headerForGames";
// import SportLeagueSelectors from "@/app/components/displayGames/sportLeagueSelector";
// import MatchCard from "@/app/components/displayGames/matchCard";
// import BetSlip from "@/app/components/displayGames/betSlip";
// import MoreOddsDialog from "@/app/components/displayGames/moreOddsDialog";
// import PredictionsDialog from "@/app/components/displayGames/predictionsDialog";

// export default function MatchesPage() {
//   const [selectedSport, setSelectedSport] = useState(null);
//   const [selectedLeague, setSelectedLeague] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [matches, setMatches] = useState([]);
//   const [oddsData, setOddsData] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeMatch, setActiveMatch] = useState(null);
//   const [betSlip, setBetSlip] = useState([]);
//   const [betAmount, setBetAmount] = useState("");
//   const [mobileBetSlipOpen, setMobileBetSlipOpen] = useState(false);
//   const [moreOddsOpen, setMoreOddsOpen] = useState(false);
//   const [selectedMatchForMoreOdds, setSelectedMatchForMoreOdds] = useState(null);
//   const [predictionsOpen, setPredictionsOpen] = useState(false);
//   const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
//   const [predictionsData, setPredictionsData] = useState(null);
//   const [loadingPredictions, setLoadingPredictions] = useState(false);
//   const isSmallScreen = useMediaQuery("(max-width:600px)");
//   const isMediumScreen = useMediaQuery("(max-width:900px)");

//   // Calculate pagination variables
//   const totalPages = Math.ceil(matches.length / matchesPerPage);
//   const indexOfLastMatch = currentPage * matchesPerPage;
//   const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
//   const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

//   useEffect(() => {
//     if (selectedLeague) {
//       const fetchMatchesAndOdds = async () => {
//   try {
//     // Fetch matches
//     const leagueId = selectedLeague.split("id=")[1];
//     const matchesResponse = await fetch(
//       `/api/fetchGames/matches?league=${leagueId}&season=2024&from=2025-03-20&to=2025-10-08`
//     );
    
//     if (!matchesResponse.ok) {
//       throw new Error("Failed to fetch matches");
//     }
    
//     const matchesData = await matchesResponse.json();
//     setMatches(matchesData.response || []);
    
//     // Fetch odds for the league
//     const leagueData = sportsData
//       .flatMap(sport => sport.leagues)
//       .find(league => league.endpoint === selectedLeague);
    
//     if (leagueData?.oddsEndpoint) {
//       try {
//         const oddsResponse = await fetch(
//           `/api/fetchGames/odds?endpoint=${encodeURIComponent(leagueData.oddsEndpoint)}`
//         );
        
//         if (!oddsResponse.ok) {
//           const errorData = await oddsResponse.json();
//           console.error("Odds API Error:", errorData);
//           throw new Error("Failed to fetch odds data");
//         }
        
//         const oddsData = await oddsResponse.json();
        
//         // Organize odds data by fixture ID
//         const oddsByFixture = {};
//         oddsData.response?.forEach?.(item => {
//           oddsByFixture[item.fixture.id] = item;
//         });
//         setOddsData(oddsByFixture);
//       } catch (oddsError) {
//         console.error("Error fetching odds:", oddsError);
//         // Continue without odds data rather than failing completely
//         setOddsData({});
//       }
//     }
    
//     setCurrentPage(1);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     setMatches([]);
//     setOddsData({});
//   }
// };

//       fetchMatchesAndOdds();
//     }
//   }, [selectedLeague]);

//   const getMatchOdds = (matchId) => {
//     const odds = oddsData[matchId];
//     if (!odds) return null;
    
//     const bookmaker = odds.bookmakers?.[0];
//     if (!bookmaker) return null;
    
//     const matchWinnerBet = bookmaker.bets.find(bet => bet.id === 1);
//     if (!matchWinnerBet) return null;
    
//     const homeOdd = matchWinnerBet.values.find(v => v.value === "Home")?.odd;
//     const drawOdd = matchWinnerBet.values.find(v => v.value === "Draw")?.odd;
//     const awayOdd = matchWinnerBet.values.find(v => v.value === "Away")?.odd;
    
//     return {
//       home: homeOdd,
//       draw: drawOdd,
//       away: awayOdd
//     };
//   };

//   const fetchPredictions = async (fixtureId) => {
//     setLoadingPredictions(true);
//     try {
//       console.log("[DEBUG] Fetching predictions for fixture:", fixtureId);
//       const response = await fetch(
//         `/api/fetchGames/predictions?fixture=${fixtureId}`
//       );
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("[ERROR] Predictions API Error:", errorData);
//         throw new Error("Failed to fetch predictions");
//       }
      
//       const data = await response.json();
//       console.log("[DEBUG] Predictions data received:", data);
//       setPredictionsData(data.response?.[0] || null);
//     } catch (error) {
//       console.error("[ERROR] in fetchPredictions:", error);
//       setPredictionsData(null);
//     } finally {
//       setLoadingPredictions(false);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleMenuOpen = (event, matchId) => {
//     setAnchorEl(event.currentTarget);
//     setActiveMatch(matchId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setActiveMatch(null);
//   };

//   const formatMatchTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatMatchDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
//   };

//   const handleAddToBetSlip = (match, betType, odds) => {
//     if (!odds) return;
    
//     const existingIndex = betSlip.findIndex(bet => bet.matchId === match.fixture.id);
    
//     if (existingIndex >= 0) {
//       const updatedBetSlip = [...betSlip];
//       updatedBetSlip[existingIndex] = {
//         matchId: match.fixture.id,
//         homeTeam: match.teams.home.name,
//         awayTeam: match.teams.away.name,
//         betType,
//         odds: parseFloat(odds),
//         date: formatMatchDate(match.fixture.date),
//         time: formatMatchTime(match.fixture.date)
//       };
//       setBetSlip(updatedBetSlip);
//     } else {
//       setBetSlip([...betSlip, {
//         matchId: match.fixture.id,
//         homeTeam: match.teams.home.name,
//         awayTeam: match.teams.away.name,
//         betType,
//         odds: parseFloat(odds),
//         date: formatMatchDate(match.fixture.date),
//         time: formatMatchTime(match.fixture.date)
//       }]);
//     }
//   };

//   const handleRemoveFromBetSlip = (matchId) => {
//     setBetSlip(betSlip.filter(bet => bet.matchId !== matchId));
//   };

//   const calculatePotentialReturn = () => {
//     if (!betAmount || isNaN(betAmount) || betAmount <= 0 || betSlip.length === 0) return "0.00";
    
//     const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
//     return (parseFloat(betAmount) * totalOdds).toFixed(2);
//   };

//   const handlePlaceBet = () => {
//     if (betSlip.length === 0 || !betAmount || isNaN(betAmount) || betAmount <= 0) {
//       alert("Please add bets to your slip and enter a valid bet amount");
//       return;
//     }
    
//     const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
//     const potentialReturn = (parseFloat(betAmount) * totalOdds).toFixed(2);
    
//     alert(`Bet placed successfully!\n\nStake: $${betAmount}\nPotential Return: $${potentialReturn}`);
    
//     setBetSlip([]);
//     setBetAmount("");
//     setMobileBetSlipOpen(false);
//   };

//   const handlePredictClick = (match) => {
//     setSelectedMatchForPredictions(match);
//     fetchPredictions(match.fixture.id);
//     setPredictionsOpen(true);
//   };

//   const handleMoreClick = (match) => {
//     setSelectedMatchForMoreOdds(match);
//     setMoreOddsOpen(true);
//   };

//   const getMoreOddsOptions = (matchId) => {
//     const odds = oddsData[matchId];
//     if (!odds) return [];
    
//     const bookmaker = odds.bookmakers?.[0];
//     if (!bookmaker) return [];
    
//     return bookmaker.bets.filter(bet => bet.id !== 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 flex flex-col">
//       <Header />
      
//       {/* Main Content */}
//       <div className="flex flex-1 gap-4 overflow-hidden">
//         {/* Matches Column */}
//         <div className="w-full flex flex-col">
//           <SportLeagueSelectors 
//             sportsData={sportsData}
//             selectedSport={selectedSport}
//             setSelectedSport={setSelectedSport}
//             selectedLeague={selectedLeague}
//             setSelectedLeague={setSelectedLeague}
//             setMatches={setMatches}
//             setOddsData={setOddsData}
//           />

//           {/* Matches List */}
//           {selectedLeague ? (
//             <div className="flex-1 flex flex-col">
//               <h2 className="text-lg sm:text-xl font-bold text-teal-400 mb-2">
//                 {sportsData
//                   .flatMap(sport => sport.leagues)
//                   .find(league => league.endpoint === selectedLeague)?.name} Matches
//               </h2>
              
//               {/* Scrollable matches container */}
//               <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
//                 {matches.length > 0 ? (
//                   <div className="grid gap-3 sm:gap-4">
//                     {currentMatches.map((match) => (
//                       <MatchCard
//                         key={match.fixture.id}
//                         match={match}
//                         odds={getMatchOdds(match.fixture.id)}
//                         isSmallScreen={isSmallScreen}
//                         handleAddToBetSlip={handleAddToBetSlip}
//                         handleMenuOpen={handleMenuOpen}
//                         handlePredictClick={handlePredictClick}
//                         handleMoreClick={handleMoreClick}
//                         formatMatchDate={formatMatchDate}
//                         formatMatchTime={formatMatchTime}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6 sm:py-8 bg-gray-800 rounded-lg">
//                     <Typography variant="h6" className="text-gray-400 text-sm sm:text-base">
//                       No matches available for this league
//                     </Typography>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg">
//               {selectedSport ? (
//                 <Typography variant="h6" className="text-gray-400 text-center">
//                   Please select a league to view matches
//                 </Typography>
//               ) : (
//                 <Typography variant="h6" className="text-gray-400 text-center">
//                   Please select a sport to begin
//                 </Typography>
//               )}
//             </div>
//           )}

//           {/* Pagination */}
//           {matches.length > matchesPerPage && (
//             <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-16 sm:mb-0">
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={currentPage === 1}
//                 className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
//                   currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
//                 }`}
//               >
//                 <FaChevronLeft className="text-sm sm:text-base" />
//                 Previous
//               </button>
              
//               <span className="text-xs sm:text-sm text-gray-300">
//                 Page {currentPage} of {totalPages}
//               </span>
              
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
//                   currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
//                 }`}
//               >
//                 Next
//                 <FaChevronRight className="text-sm sm:text-base" />
//               </button>
//             </div>
//           )}
//         </div>

//         <BetSlip
//           betSlip={betSlip}
//           betAmount={betAmount}
//           setBetAmount={setBetAmount}
//           handleRemoveFromBetSlip={handleRemoveFromBetSlip}
//           calculatePotentialReturn={calculatePotentialReturn}
//           handlePlaceBet={handlePlaceBet}
//           isMediumScreen={isMediumScreen}
//           mobileBetSlipOpen={mobileBetSlipOpen}
//           setMobileBetSlipOpen={setMobileBetSlipOpen}
//         />
//       </div>

//       <MoreOddsDialog
//         moreOddsOpen={moreOddsOpen}
//         setMoreOddsOpen={setMoreOddsOpen}
//         selectedMatchForMoreOdds={selectedMatchForMoreOdds}
//         getMoreOddsOptions={getMoreOddsOptions}
//         handleAddToBetSlip={handleAddToBetSlip}
//         formatMatchDate={formatMatchDate}
//         formatMatchTime={formatMatchTime}
//       />

//       <PredictionsDialog
//         predictionsOpen={predictionsOpen}
//         setPredictionsOpen={setPredictionsOpen}
//         selectedMatchForPredictions={selectedMatchForPredictions}
//         predictionsData={predictionsData}
//         loadingPredictions={loadingPredictions}
//         formatMatchDate={formatMatchDate}
//         formatMatchTime={formatMatchTime}
//       />

//       {/* Menu for small screens */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           style: {
//             backgroundColor: '#1F2937',
//             color: 'white',
//           },
//         }}
//       >
//         {activeMatch && matches.find(m => m.fixture.id === activeMatch) && (
//           (() => {
//             const match = matches.find(m => m.fixture.id === activeMatch);
//             const odds = getMatchOdds(activeMatch);
            
//             return [
//               <MuiMenuItem key="home" onClick={(e) => {
//                 handleAddToBetSlip(match, 'home', odds?.home);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.home}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="primary"
//                   size="small"
//                   className="text-xs"
//                   startIcon={<Avatar src={match?.teams.home.logo} className="w-3 h-3" />}
//                 >
//                   Win Home @ {odds?.home || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="draw" onClick={(e) => {
//                 handleAddToBetSlip(match, 'draw', odds?.draw);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.draw}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="secondary"
//                   size="small"
//                   className="text-xs"
//                 >
//                   Draw @ {odds?.draw || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="away" onClick={(e) => {
//                 handleAddToBetSlip(match, 'away', odds?.away);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.away}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="error"
//                   size="small"
//                   className="text-xs"
//                   startIcon={<Avatar src={match?.teams.away.logo} className="w-3 h-3" />}
//                 >
//                   Win Away @ {odds?.away || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="predict" onClick={(e) => {
//                 handlePredictClick(match);
//                 handleMenuClose();
//               }}>
//                 <Button 
//                   fullWidth
//                   variant="outlined" 
//                   color="info"
//                   size="small"
//                   className="text-xs"
//                 >
//                   Predict
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="more" onClick={(e) => {
//                 handleMoreClick(match);
//                 handleMenuClose();
//               }}>
//                 <Button 
//                   fullWidth
//                   variant="outlined" 
//                   color="inherit"
//                   size="small"
//                   className="text-xs"
//                 >
//                   More
//                 </Button>
//               </MuiMenuItem>
//             ]
//           })()
//         )}
//       </Menu>
//     </div>
//   );
// }


//new code 
// "use client";
// import { useState, useEffect } from "react";
// import { FaHome, FaChevronLeft, FaChevronRight, FaEllipsisV } from "react-icons/fa";
// import { 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel, 
//   Typography,
//   Avatar,
//   Button,
//   Menu,
//   MenuItem as MuiMenuItem,
//   useMediaQuery,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Chip,
//   Divider
// } from "@mui/material";

// const sportsData = [
//   { 
//     name: 'Football', 
//     //component: FootballMatches,
//     leagues: [
//       { name: 'Premier League', endpoint: 'https://v3.football.api-sports.io/leagues?id=39', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=39' },
//       { name: 'La Liga', endpoint: 'https://v3.football.api-sports.io/leagues?id=140', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=140' },
//       { name: 'Serie A', endpoint: 'https://v3.football.api-sports.io/leagues?id=135', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=135' },
//       { name: 'Bundesliga', endpoint: 'https://v3.football.api-sports.io/leagues?id=78', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=78' },
//       { name: 'Ligue 1', endpoint: 'https://v3.football.api-sports.io/leagues?id=61', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=61' },
//       { name: 'UEFA Champions League', endpoint: 'https://v3.football.api-sports.io/leagues?id=2', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=2' },
//       { name: "Primeira Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=94", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=94' },
//       { name: "MLS", endpoint: "https://v3.football.api-sports.io/leagues?id=253", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=253' },
//       { name: "Eredivisie", endpoint: "https://v3.football.api-sports.io/leagues?id=88", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=88' },
//       { name: "Europa league", endpoint: "https://v3.football.api-sports.io/leagues?id=3", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=3' },
//     ] 
//   },
//   { 
//     name: 'Hockey', 
//     //component: HockeyMatches,
//     leagues: [
//       { name: 'AHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=58&season=2024', oddsEndpoint:"https://v1.hockey.api-sports.io/odds?season=2024&league=58"},
//       { name: 'CHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=125&season=2024'},
//       { name: 'ECHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=59&season=2024'},
//       { name: 'FHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=61&season=2024'},
//       { name: 'FPHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=260&season=2024'},
//       { name: 'NCAA', endpoint: 'https://v1.hockey.api-sports.io/games?league=256&season=2024'},
//       { name: 'NHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=57&season=2024'},
//       { name: 'SPHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=60&season=2024'},
//       { name: 'USHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=62&season=2024'},
//     ] 
//   },
//   { 
//     name: 'Baseball', 
//     //component: BaseballMatches,
//     leagues: [
//       { name: 'FL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=67' },
//       { name: 'IL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=3' },
//       { name: 'MLB', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=1' },
//       { name: 'MLB_Spring Training', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=71' },
//       { name: 'PCL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=4' },
//       { name: 'Triple A-East', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=60' },
//       { name: 'Triple A national Championship', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=33' },
//       { name: 'Triple A West', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=61' },
//     ] 
//   },
//   { 
//     name: 'BasketBall', 
//     //component: BasketballMatches,
//     leagues: [
//       { name: 'NBA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=12',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=12&season=2024-2025" },
//       { name: 'NBA G-League', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=20', oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=20&season=2024-2025" },
//       { name: 'NBA Sacramento Summer league', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=21',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=21&season=2024-2025" },
//       { name: 'NBA Cup', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=422',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=422&season=2024-2025" },
//       { name: 'NCAA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=116',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=166&season=2024-2025" },
//     ] 
//   },
//   { 
//     name: 'Formula 1', 
//     //component: Formula1Matches,
//     leagues: [
//       { name: 'F1 World Championship', endpoint: 'https://v1.formula-1.api-sports.io/leagues?id=1' },
//     ] 
//   },
//   { 
//     name: 'Rugby', 
//     //component: RugbyMatches,
//     leagues: [
//       { name: 'Major League Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=44' },
//       { name: 'Pro Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=43' },
//     ] 
//   },
//   { 
//     name: 'AFL', 
//     //component: AFLMatches,
//     leagues: [
//       { name: 'AFL Premiership', endpoint: 'https://v1.afl.api-sports.io/leagues?id=1' },
//     ] 
//   },
// ];

// export default function MatchesPage() {
//   const [selectedSport, setSelectedSport] = useState(null);
//   const [leagues, setLeagues] = useState([]);
//   const [selectedLeague, setSelectedLeague] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [matches, setMatches] = useState([]);
//   const [oddsData, setOddsData] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeMatch, setActiveMatch] = useState(null);
//   const [betSlip, setBetSlip] = useState([]);
//   const [betAmount, setBetAmount] = useState("");
//   const [mobileBetSlipOpen, setMobileBetSlipOpen] = useState(false);
//   const [moreOddsOpen, setMoreOddsOpen] = useState(false);
//   const [selectedMatchForMoreOdds, setSelectedMatchForMoreOdds] = useState(null);
//   const [predictionsOpen, setPredictionsOpen] = useState(false);
//   const [selectedMatchForPredictions, setSelectedMatchForPredictions] = useState(null);
//   const [predictionsData, setPredictionsData] = useState(null);
//   const [loadingPredictions, setLoadingPredictions] = useState(false);
//   const matchesPerPage = 10;
//   const isSmallScreen = useMediaQuery("(max-width:600px)");
//   const isMediumScreen = useMediaQuery("(max-width:900px)");
//   const [loadingOdds, setLoadingOdds] = useState({});
// const [oddsError, setOddsError] = useState({});

  

//   // Calculate pagination variables
//   const totalPages = Math.ceil(matches.length / matchesPerPage);
//   const indexOfLastMatch = currentPage * matchesPerPage;
//   const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
//   const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

//   const getUserTimezone = () => {
//     return Intl.DateTimeFormat().resolvedOptions().timeZone;
//   };

//   const formatMatchTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       timeZone: getUserTimezone()
//     });
//   };

//   const formatMatchDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString([], { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric',
//       timeZone: getUserTimezone()
//     });
//   };

//   useEffect(() => {
//     if (selectedSport) {
//       const fetchLeagueLogos = async () => {
//         const updatedLeagues = await Promise.all(
//           selectedSport.leagues.map(async (league) => {
//             try {
//               const response = await fetch(league.endpoint, {
//                 method: "GET",
//                 headers: {
//                   "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
//                 },
//               });
//               if (!response.ok) throw new Error("Failed to fetch league data");
//               const data = await response.json();
//               const logo = data.response[0]?.league?.logo || "";
//               return { ...league, logo };
//             } catch (error) {
//               console.error(`Error fetching logo for ${league.name}:`, error);
//               return { ...league, logo: "" };
//             }
//           })
//         );
//         setLeagues(updatedLeagues);
//       };

//       fetchLeagueLogos();
//     }
//   }, [selectedSport]);
//  // Update the main data fetching useEffect
// useEffect(() => {
//   if (!selectedLeague) return;

//   const fetchData = async () => {
//     try {
//       // 1. Fetch matches
//       const leagueId = selectedLeague.split("id=")[1];
//       const matchesResponse = await fetch(
//         `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2024`,
//         {
//           headers: {
//             "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
//           },
//         }
//       );

//       if (!matchesResponse.ok) throw new Error("Failed to fetch matches");
//       const matchesData = await matchesResponse.json();

//       const activeMatches = (matchesData.response || []).filter(
//         match => match.fixture.status.short !== "FT" && 
//                 match.fixture.status.long !== "Match Finished"
//       );

//       const sortedMatches = activeMatches.sort((a, b) => {
//         return new Date(a.fixture.date) - new Date(b.fixture.date);
//       });

//       setMatches(sortedMatches);
//       setCurrentPage(1);

//       // Initialize empty odds data for all matches
//       setOddsData(prev => ({
//         ...prev,
//         ...Object.fromEntries(sortedMatches.map(match => [match.fixture.id, null]))
//       }));
//     } catch (error) {
//       console.error("Data fetch error:", error);
//     }
//   };

//   fetchData();
// }, [selectedLeague]);

// // Add new useEffect to fetch odds only for current page matches
// useEffect(() => {
//   if (matches.length === 0) return;

//   const fetchCurrentPageOdds = async () => {
//     const currentPageMatchIds = currentMatches.map(match => match.fixture.id);
    
//     // Set loading states for current page matches
//     setLoadingOdds(prev => ({
//       ...prev,
//       ...Object.fromEntries(currentPageMatchIds.map(id => [id, true]))
//     }));
    
//     // Fetch odds only for current page matches
//     const oddsPromises = currentMatches.map(async match => {
//       try {
//         const response = await fetch(
//           `https://v3.football.api-sports.io/odds?fixture=${match.fixture.id}`,
//           {
//             headers: {
//               "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
//             },
//           }
//         );
        
//         if (!response.ok) throw new Error("Failed to fetch odds");
//         const data = await response.json();
        
//         return {
//           matchId: match.fixture.id,
//           odds: data.response?.[0] || null
//         };
//       } catch (error) {
//         console.error(`Error fetching odds for match ${match.fixture.id}:`, error);
//         setOddsError(prev => ({ ...prev, [match.fixture.id]: true }));
//         return {
//           matchId: match.fixture.id,
//           odds: null
//         };
//       }
//     });

//     const results = await Promise.all(oddsPromises);
    
//     // Update odds data only for the matches we fetched
//     setOddsData(prev => ({
//       ...prev,
//       ...Object.fromEntries(results.map(result => [result.matchId, result.odds]))
//     }));
    
//     // Clear loading states
//     setLoadingOdds(prev => {
//       const newState = {...prev};
//       currentPageMatchIds.forEach(id => delete newState[id]);
//       return newState;
//     });
//   };

//   fetchCurrentPageOdds();
// }, [currentPage, matches]); // Run when page or matches change

//   // Update getMatchOdds to handle loading states
// const getMatchOdds = (matchId) => {
//   if (loadingOdds[matchId]) {
//     return null; // Still loading
//   }
  
//   const odds = oddsData[matchId];
//   if (!odds) return null;
  
//   // Try to find odds from any bookmaker
//   for (const bookmaker of odds.bookmakers || []) {
//     const matchWinnerBet = bookmaker.bets.find(bet => bet.id === 1);
//     if (!matchWinnerBet) continue;
    
//     const homeOdd = matchWinnerBet.values.find(v => v.value === "Home")?.odd;
//     const drawOdd = matchWinnerBet.values.find(v => v.value === "Draw")?.odd;
//     const awayOdd = matchWinnerBet.values.find(v => v.value === "Away")?.odd;
    
//     if (homeOdd && drawOdd && awayOdd) {
//       return {
//         home: homeOdd,
//         draw: drawOdd,
//         away: awayOdd
//       };
//     }
//   }
  
//   return null;
// };

//   const fetchPredictions = async (fixtureId) => {
//     setLoadingPredictions(true);
//     try {
//       const response = await fetch(
//         `https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`,
//         {
//           method: "GET",
//           headers: {
//             "x-apisports-key": process.env.NEXT_PUBLIC_SPORTS_API_KEY,
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to fetch predictions");
//       const data = await response.json();
//       setPredictionsData(data.response?.[0] || null);
//     } catch (error) {
//       console.error("Error fetching predictions:", error);
//       setPredictionsData(null);
//     } finally {
//       setLoadingPredictions(false);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleMenuOpen = (event, matchId) => {
//     setAnchorEl(event.currentTarget);
//     setActiveMatch(matchId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setActiveMatch(null);
//   };

//   const handleSportSelect = (sport) => {
//     setSelectedSport(sport);
//     setSelectedLeague(null);
//     setMatches([]);
//     setOddsData({});
//   };

//   const handleLeagueSelect = (leagueEndpoint) => {
//     setSelectedLeague(leagueEndpoint);
//   };

//   const handleAddToBetSlip = (match, betType, odds) => {
//     if (!odds) return;
    
//     const existingIndex = betSlip.findIndex(bet => bet.matchId === match.fixture.id);
    
//     if (existingIndex >= 0) {
//       const updatedBetSlip = [...betSlip];
//       updatedBetSlip[existingIndex] = {
//         matchId: match.fixture.id,
//         homeTeam: match.teams.home.name,
//         awayTeam: match.teams.away.name,
//         betType,
//         odds: parseFloat(odds),
//         date: formatMatchDate(match.fixture.date),
//         time: formatMatchTime(match.fixture.date)
//       };
//       setBetSlip(updatedBetSlip);
//     } else {
//       setBetSlip([...betSlip, {
//         matchId: match.fixture.id,
//         homeTeam: match.teams.home.name,
//         awayTeam: match.teams.away.name,
//         betType,
//         odds: parseFloat(odds),
//         date: formatMatchDate(match.fixture.date),
//         time: formatMatchTime(match.fixture.date)
//       }]);
//     }
//   };

//   const handleRemoveFromBetSlip = (matchId) => {
//     setBetSlip(betSlip.filter(bet => bet.matchId !== matchId));
//   };

//   const calculatePotentialReturn = () => {
//     if (!betAmount || isNaN(betAmount) || betAmount <= 0 || betSlip.length === 0) return "0.00";
    
//     const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
//     return (parseFloat(betAmount) * totalOdds).toFixed(2);
//   };

//   const handlePlaceBet = () => {
//     if (betSlip.length === 0 || !betAmount || isNaN(betAmount) || betAmount <= 0) {
//       alert("Please add bets to your slip and enter a valid bet amount");
//       return;
//     }
    
//     const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
//     const potentialReturn = (parseFloat(betAmount) * totalOdds).toFixed(2);
    
//     alert(`Bet placed successfully!\n\nStake: $${betAmount}\nPotential Return: $${potentialReturn}`);
    
//     setBetSlip([]);
//     setBetAmount("");
//     setMobileBetSlipOpen(false);
//   };

//   const handlePredictClick = (match) => {
//     setSelectedMatchForPredictions(match);
//     fetchPredictions(match.fixture.id);
//     setPredictionsOpen(true);
//   };

//   const handleMoreClick = (match) => {
//     setSelectedMatchForMoreOdds(match);
//     setMoreOddsOpen(true);
//   };

//   const getMoreOddsOptions = (matchId) => {
//     const odds = oddsData[matchId];
//     if (!odds) return [];
    
//     const bookmaker = odds.bookmakers?.[0];
//     if (!bookmaker) return [];
    
//     return bookmaker.bets.filter(bet => bet.id !== 1);
//   };

//   const renderPredictionComparison = (home, draw, away) => {
//     const total = home + draw + away;
//     const homePercent = Math.round((home / total) * 100);
//     const drawPercent = Math.round((draw / total) * 100);
//     const awayPercent = Math.round((away / total) * 100);

//     return (
//       <div className="w-full">
//         <div className="flex justify-between mb-1">
//           <span className="text-sm font-medium">Home: {homePercent}%</span>
//           <span className="text-sm font-medium">Draw: {drawPercent}%</span>
//           <span className="text-sm font-medium">Away: {awayPercent}%</span>
//         </div>
//         <div className="flex h-4 rounded-md overflow-hidden">
//           <div 
//             className="bg-blue-500" 
//             style={{ width: `${homePercent}%` }}
//             title={`Home: ${homePercent}%`}
//           ></div>
//           <div 
//             className="bg-gray-500" 
//             style={{ width: `${drawPercent}%` }}
//             title={`Draw: ${drawPercent}%`}
//           ></div>
//           <div 
//             className="bg-red-500" 
//             style={{ width: `${awayPercent}%` }}
//             title={`Away: ${awayPercent}%`}
//           ></div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 flex flex-col">
//       {/* Header */}
//       <div className="bg-teal-500 text-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 sm:mb-6 flex justify-between items-center">
//         <div className="flex items-center gap-2 sm:gap-3">
//           <img
//             src="/images/BundlesBetsLogo.png"
//             alt="Bundlesbets Logo"
//             className="w-8 h-8 sm:w-10 sm:h-10"
//           />
//           <span className="text-lg sm:text-2xl font-bold">Sports Games</span>
//         </div>
//         <a href="/otherPages/dashboard" className="text-sm font-semibold hover:underline">
//           <FaHome className="text-xl sm:text-2xl" />
//         </a>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 gap-4 overflow-hidden">
//         {/* Matches Column */}
//         <div className="w-full flex flex-col">
//           {/* Sport and League Selectors */}
//           <div className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Sport Selector */}
//             <FormControl fullWidth>
//               <InputLabel id="sport-select-label" className="text-gray-300 text-sm sm:text-base">
//                 Select Sport
//               </InputLabel>
//               <Select
//                 labelId="sport-select-label"
//                 value={selectedSport?.name || ""}
//                 label="Select Sport"
//                 onChange={(e) => {
//                   const sport = sportsData.find(s => s.name === e.target.value);
//                   handleSportSelect(sport);
//                 }}
//                 className="bg-teal-100 text-white rounded-lg"
//                 sx={{
//                   "& .MuiSelect-icon": { color: "white" },
//                   "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
//                 }}
//               >
//                 {sportsData.map((sport) => (
//                   <MenuItem 
//                     key={sport.name} 
//                     value={sport.name}
//                     className="bg-gray-800 hover:bg-gray-700 text-white"
//                   >
//                     <span className="text-sm sm:text-base">{sport.name}</span>
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* League Selector - Only shown when a sport is selected */}
//             {selectedSport && (
//               <FormControl fullWidth>
//                 <InputLabel id="league-select-label" className="text-gray-300 text-sm sm:text-base">
//                   Select League
//                 </InputLabel>
//                 <Select
//                   labelId="league-select-label"
//                   value={selectedLeague || ""}
//                   label="Select League"
//                   onChange={(e) => handleLeagueSelect(e.target.value)}
//                   className="bg-teal-100 text-white rounded-lg"
//                   sx={{
//                     "& .MuiSelect-icon": { color: "white" },
//                     "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.600" },
//                   }}
//                   renderValue={(selected) => {
//                     const selectedLeagueData = leagues.find((league) => league.endpoint === selected);
//                     return (
//                       <div className="flex items-center gap-2">
//                         {selectedLeagueData?.logo && (
//                           <img 
//                             src={selectedLeagueData.logo} 
//                             alt={selectedLeagueData.name} 
//                             className="w-5 h-5 sm:w-6 sm:h-6"
//                           />
//                         )}
//                         <span className="text-sm sm:text-base">{selectedLeagueData?.name}</span>
//                       </div>
//                     );
//                   }}
//                 >
//                   {leagues.map((league) => (
//                     <MenuItem 
//                       key={league.endpoint} 
//                       value={league.endpoint}
//                       className="bg-gray-800 hover:bg-gray-700 text-white"
//                     >
//                       <div className="flex items-center gap-2">
//                         {league.logo && (
//                           <img src={league.logo} alt={league.name} className="w-5 h-5 sm:w-6 sm:h-6" />
//                         )}
//                         <span className="text-sm sm:text-base">{league.name}</span>
//                       </div>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )}
//           </div>

//           {/* Matches List */}
//           {selectedLeague ? (
//             <div className="flex-1 flex flex-col">
//               <h2 className="text-lg sm:text-xl font-bold text-teal-400 mb-2">
//                 {leagues.find((league) => league.endpoint === selectedLeague)?.name} Matches
//               </h2>
              
//               {/* Scrollable matches container */}
//               <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
//                 {matches.length > 0 ? (
//                   <div className="grid gap-3 sm:gap-4">
//                     {currentMatches.map((match) => {
//                       const odds = getMatchOdds(match.fixture.id);
//                       const homeOdds = odds?.home || "N/A";
//                       const drawOdds = odds?.draw || "N/A";
//                       const awayOdds = odds?.away || "N/A";

//                       return (
//                         <div 
//                           key={match.fixture.id} 
//                           className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-teal-500 hover:bg-gray-700 transition-colors"
//                         >
//                           {/* Date and Time */}
//                           <div className="flex justify-between items-start mb-2">
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs sm:text-sm font-medium text-teal-400">
//                                 {formatMatchDate(match.fixture.date)}
//                               </span>
//                               <span className="text-xs sm:text-sm text-gray-400">
//                                 {formatMatchTime(match.fixture.date)}
//                               </span>
//                             </div>
                            
//                             {isSmallScreen && (
//                               <button 
//                                 onClick={(e) => handleMenuOpen(e, match.fixture.id)}
//                                 className="text-gray-400 hover:text-white"
//                               >
//                                 <FaEllipsisV />
//                               </button>
//                             )}
//                           </div>
                          
//                           {/* Teams and bet buttons */}
//                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
//                             {/* Teams */}
//                             <div className="flex-1 flex items-center gap-1 min-w-0">
//                               <div className="flex items-center gap-1">
//                                 <Avatar 
//                                   src={match.teams.home.logo} 
//                                   alt={match.teams.home.name}
//                                   className="w-5 h-5 sm:w-6 sm:h-6"
//                                 />
//                                 <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
//                                   {match.teams.home.name}
//                                 </span>
//                               </div>
                              
//                               <span className="mx-1 text-xs sm:text-sm font-bold">vs</span>
                              
//                               <div className="flex items-center gap-1">
//                                 <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[100px]">
//                                   {match.teams.away.name}
//                                 </span>
//                                 <Avatar 
//                                   src={match.teams.away.logo} 
//                                   alt={match.teams.away.name}
//                                   className="w-5 h-5 sm:w-6 sm:h-6"
//                                 />
//                               </div>
//                             </div>

//                             {/* Bet buttons */}
//                             {!isSmallScreen && (
//                               <div className="flex gap-1">
//                                 <Button 
//                                   variant="contained" 
//                                   size="small"
//                                   color="primary"
//                                   className="text-xs px-2 py-1 min-w-0"
//                                   onClick={() => odds?.home && handleAddToBetSlip(match, 'home', homeOdds)}
//                                   startIcon={<Avatar src={match.teams.home.logo} className="w-3 h-3" />}
//                                   disabled={!odds?.home}
//                                 >
//                                   {homeOdds}
//                                 </Button>
//                                 <Button 
//                                   variant="contained" 
//                                   size="small"
//                                   color="secondary"
//                                   className="text-xs px-2 py-1 min-w-0"
//                                   onClick={() => odds?.draw && handleAddToBetSlip(match, 'draw', drawOdds)}
//                                   disabled={!odds?.draw}
//                                 >
//                                   {drawOdds}
//                                 </Button>
//                                 <Button 
//                                   variant="contained" 
//                                   size="small"
//                                   color="error"
//                                   className="text-xs px-2 py-1 min-w-0"
//                                   onClick={() => odds?.away && handleAddToBetSlip(match, 'away', awayOdds)}
//                                   startIcon={<Avatar src={match.teams.away.logo} className="w-3 h-3" />}
//                                   disabled={!odds?.away}
//                                 >
//                                   {awayOdds}
//                                 </Button>
//                               </div>
//                             )}
//                           </div>

//                           {/* Score and action buttons */}
//                           <div className="flex justify-between items-center">
//                             {/* Score */}
//                             {match.goals.home !== null && match.goals.away !== null && (
//                               <div className="inline-flex items-center bg-gray-700 px-2 py-0.5 rounded-full">
//                                 <span className="text-xs sm:text-sm font-bold">
//                                   {match.goals.home} - {match.goals.away}
//                                 </span>
//                               </div>
//                             )}

//                             {/* Predict and More buttons */}
//                             {!isSmallScreen && (
//                               <div className="flex gap-1 ml-auto">
//                                 <Button 
//                                   variant="outlined" 
//                                   size="small"
//                                   color="info"
//                                   className="text-xs px-2 py-1 min-w-0"
//                                   onClick={() => handlePredictClick(match)}
//                                 >
//                                   Predict
//                                 </Button>
//                                 <Button 
//                                   variant="outlined" 
//                                   size="small"
//                                   color="inherit"
//                                   className="text-xs px-2 py-1 min-w-0"
//                                   onClick={() => handleMoreClick(match)}
//                                 >
//                                   More
//                                 </Button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6 sm:py-8 bg-gray-800 rounded-lg">
//                     <Typography variant="h6" className="text-gray-400 text-sm sm:text-base">
//                       No matches available for this league
//                     </Typography>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg">
//               {selectedSport ? (
//                 <Typography variant="h6" className="text-gray-400 text-center">
//                   Please select a league to view matches
//                 </Typography>
//               ) : (
//                 <Typography variant="h6" className="text-gray-400 text-center">
//                   Please select a sport to begin
//                 </Typography>
//               )}
//             </div>
//           )}

//           {/* Pagination */}
//           {matches.length > matchesPerPage && (
//             <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 mb-16 sm:mb-0">
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={currentPage === 1}
//                 className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
//                   currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
//                 }`}
//               >
//                 <FaChevronLeft className="text-sm sm:text-base" />
//                 Previous
//               </button>
              
//               <span className="text-xs sm:text-sm text-gray-300">
//                 Page {currentPage} of {totalPages}
//               </span>
              
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className={`flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
//                   currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-teal-600 hover:bg-teal-700 text-white'
//                 }`}
//               >
//                 Next
//                 <FaChevronRight className="text-sm sm:text-base" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Bet Slip Column - Only show on larger screens */}
//         {!isMediumScreen && (
//           <div className="hidden md:block md:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col">
//             <h2 className="text-lg font-bold text-teal-400 mb-4">Bet Slip</h2>
            
//             {/* Scrollable bet slip container */}
//             <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
//               {betSlip.length > 0 ? (
//                 betSlip.map((bet) => (
//                   <div key={bet.matchId} className="bg-gray-700 p-3 rounded-lg">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-sm font-medium">
//                           {bet.homeTeam} vs {bet.awayTeam}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {bet.date} {bet.time}
//                         </p>
//                         <p className="text-xs mt-1">
//                           Bet: {bet.betType === 'home' ? 'Home Win' : 
//                                bet.betType === 'away' ? 'Away Win' : 'Draw'} @ {bet.odds}
//                         </p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveFromBetSlip(bet.matchId)}
//                         className="text-gray-400 hover:text-white text-lg"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex-1 flex items-center justify-center h-full">
//                   <p className="text-gray-400 text-center">Add selections to your bet slip</p>
//                 </div>
//               )}
//             </div>

//             {/* Bet amount and place bet button */}
//             <div className="mt-auto">
//               <TextField
//                 label="Bet Amount"
//                 type="number"
//                 value={betAmount}
//                 onChange={(e) => setBetAmount(e.target.value)}
//                 fullWidth
//                 size="small"
//                 className="mb-3"
//                 inputProps={{
//                   min: "1",
//                   step: "1"
//                 }}
//                 InputLabelProps={{
//                   className: "text-gray-300"
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "gray.600",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "gray.500",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "teal.500",
//                     },
//                   },
//                   "& .MuiInputBase-input": {
//                     color: "white",
//                   },
//                 }}
//               />

//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-sm text-gray-300">Potential Return:</span>
//                 <span className="font-bold text-teal-400">${calculatePotentialReturn()}</span>
//               </div>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={betSlip.length === 0 || !betAmount}
//                 onClick={handlePlaceBet}
//                 className="bg-teal-600 hover:bg-teal-700"
//               >
//                 Place Bet
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Mobile Bet Slip Button - Fixed at bottom */}
//       {isMediumScreen && betSlip.length > 0 && (
//         <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 border-t border-gray-700 z-10">
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={() => setMobileBetSlipOpen(true)}
//             className="bg-teal-600 hover:bg-teal-700"
//           >
//             View Bet Slip ({betSlip.length})
//           </Button>
//         </div>
//       )}

//       {/* Mobile Bet Slip Dialog */}
//       <Dialog
//         open={mobileBetSlipOpen}
//         onClose={() => setMobileBetSlipOpen(false)}
//         fullScreen={isSmallScreen}
//         PaperProps={{
//           style: {
//             backgroundColor: '#1F2937',
//             color: 'white',
//           },
//         }}
//       >
//         <DialogTitle className="text-teal-400">Your Bet Slip</DialogTitle>
//         <DialogContent>
//           <div className="space-y-3">
//             {betSlip.length > 0 ? (
//               betSlip.map((bet) => (
//                 <div key={bet.matchId} className="bg-gray-700 p-3 rounded-lg">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium">
//                         {bet.homeTeam} vs {bet.awayTeam}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {bet.date} {bet.time}
//                       </p>
//                       <p className="text-xs mt-1">
//                         Bet: {bet.betType === 'home' ? 'Home Win' : 
//                              bet.betType === 'away' ? 'Away Win' : 'Draw'} @ {bet.odds}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={() => handleRemoveFromBetSlip(bet.matchId)}
//                       className="text-gray-400 hover:text-white text-lg"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-400 text-center py-4">No bets in your slip</p>
//             )}
//           </div>

//           <div className="mt-4">
//             <TextField
//               label="Bet Amount"
//               type="number"
//               value={betAmount}
//               onChange={(e) => setBetAmount(e.target.value)}
//               fullWidth
//               size="small"
//               className="mb-3"
//               inputProps={{
//                 min: "1",
//                 step: "1"
//               }}
//               InputLabelProps={{
//                 className: "text-gray-300"
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "gray.600",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "gray.500",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "teal.500",
//                   },
//                 },
//                 "& .MuiInputBase-input": {
//                   color: "white",
//                 },
//               }}
//             />

//             <div className="flex justify-between items-center mb-4">
//               <span className="text-sm text-gray-300">Potential Return:</span>
//               <span className="font-bold text-teal-400">${calculatePotentialReturn()}</span>
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setMobileBetSlipOpen(false)} color="inherit">
//             Close
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handlePlaceBet}
//             className="bg-teal-600 hover:bg-teal-700"
//           >
//             Place Bet
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* More Odds Dialog */}
//       <Dialog
//         open={moreOddsOpen}
//         onClose={() => setMoreOddsOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           style: {
//             backgroundColor: '#1F2937',
//             color: 'white',
//           },
//         }}
//       >
//         <DialogTitle className="text-teal-400">
//           {selectedMatchForMoreOdds && (
//             <>
//               {selectedMatchForMoreOdds.teams.home.name} vs {selectedMatchForMoreOdds.teams.away.name}
//               <div className="text-sm text-gray-400">
//                 {formatMatchDate(selectedMatchForMoreOdds?.fixture.date)} at {formatMatchTime(selectedMatchForMoreOdds?.fixture.date)}
//               </div>
//             </>
//           )}
//         </DialogTitle>
//         <DialogContent>
//           {selectedMatchForMoreOdds && (
//             <div className="space-y-4">
//               {getMoreOddsOptions(selectedMatchForMoreOdds.fixture.id).map((bet) => (
//                 <div key={bet.id} className="bg-gray-800 p-3 rounded-lg">
//                   <h3 className="font-bold text-teal-400 mb-2">{bet.name}</h3>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                     {bet.values.map((value) => (
//                       <Button
//                         key={value.value}
//                         variant="outlined"
//                         color="primary"
//                         size="small"
//                         className="text-xs"
//                         onClick={() => {
//                           handleAddToBetSlip(
//                             selectedMatchForMoreOdds, 
//                             `${bet.name} - ${value.value}`, 
//                             value.odd
//                           );
//                           setMoreOddsOpen(false);
//                         }}
//                       >
//                         {value.value} @ {value.odd}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setMoreOddsOpen(false)} color="inherit">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Predictions Dialog */}
//       <Dialog
//         open={predictionsOpen}
//         onClose={() => setPredictionsOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           style: {
//             backgroundColor: '#1F2937',
//             color: 'white',
//           },
//         }}
//       >
//         <DialogTitle className="text-teal-400">
//           {selectedMatchForPredictions && (
//             <>
//               Match Prediction: {selectedMatchForPredictions.teams.home.name} vs {selectedMatchForPredictions.teams.away.name}
//               <div className="text-sm text-gray-400">
//                 {formatMatchDate(selectedMatchForPredictions?.fixture.date)} at {formatMatchTime(selectedMatchForPredictions?.fixture.date)}
//               </div>
//             </>
//           )}
//         </DialogTitle>
//         <DialogContent>
//           {loadingPredictions ? (
//             <div className="flex justify-center items-center h-40">
//               <CircularProgress />
//             </div>
//           ) : predictionsData ? (
//             <div className="space-y-4">
//               {/* Match Info */}
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Avatar src={selectedMatchForPredictions?.teams.home.logo} />
//                   <span className="font-medium">{selectedMatchForPredictions?.teams.home.name}</span>
//                 </div>
//                 <span className="mx-2 font-bold">vs</span>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">{selectedMatchForPredictions?.teams.away.name}</span>
//                   <Avatar src={selectedMatchForPredictions?.teams.away.logo} />
//                 </div>
//               </div>

//               <Divider className="my-3 bg-gray-600" />

//               {/* Prediction Comparison */}
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Prediction Comparison</h3>
//                 {renderPredictionComparison(
//                   predictionsData.predictions.percent.home,
//                   predictionsData.predictions.percent.draw,
//                   predictionsData.predictions.percent.away
//                 )}
//               </div>

//               {/* Winner Prediction */}
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Winner Prediction</h3>
//                 <div className="bg-gray-800 p-3 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">Predicted Winner:</span>
//                     <Chip 
//                       label={predictionsData.predictions.winner?.name || 'No clear winner'} 
//                       color={
//                         predictionsData.predictions.winner?.id === selectedMatchForPredictions?.teams.home.id ? 'primary' :
//                         predictionsData.predictions.winner?.id === selectedMatchForPredictions?.teams.away.id ? 'error' : 'default'
//                       }
//                     />
//                   </div>
//                   <div className="mt-2">
//                     <span className="text-sm text-gray-400">Advice: {predictionsData.predictions.advice || 'No advice available'}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Goals Stats */}
//               <div>
//                 <h3 className="font-bold text-lg mb-2">Goals Stats</h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-800 p-3 rounded-lg">
//                     <h4 className="font-medium text-teal-400 mb-1">Home Team</h4>
//                     <p className="text-sm">Goals For: {predictionsData.teams.home.league.goals?.for?.total?.average || 'N/A'}</p>
//                     <p className="text-sm">Goals Against: {predictionsData.teams.home.league.goals?.against?.total?.average || 'N/A'}</p>
//                   </div>
//                   <div className="bg-gray-800 p-3 rounded-lg">
//                     <h4 className="font-medium text-teal-400 mb-1">Away Team</h4>
//                     <p className="text-sm">Goals For: {predictionsData.teams.away.league.goals?.for?.total?.average || 'N/A'}</p>
//                     <p className="text-sm">Goals Against: {predictionsData.teams.away.league.goals?.against?.total?.average || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* H2H Stats */}
//               {predictionsData.h2h.length > 0 && (
//                 <div>
//                   <h3 className="font-bold text-lg mb-2">Last 5 Head-to-Head Matches</h3>
//                   <div className="space-y-2">
//                     {predictionsData.h2h.slice(0, 5).map((match, index) => (
//                       <div key={index} className="bg-gray-800 p-2 rounded-lg">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">{new Date(match.fixture.date).toLocaleDateString()}</span>
//                           <span className="text-sm font-bold">
//                             {match.teams.home.name} {match.goals.home} - {match.goals.away} {match.teams.away.name}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-6">
//               <Typography variant="h6" className="text-gray-400">
//                 No prediction data available for this match
//               </Typography>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setPredictionsOpen(false)} color="inherit">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Menu for small screens */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           style: {
//             backgroundColor: '#1F2937',
//             color: 'white',
//           },
//         }}
//       >
//         {activeMatch && matches.find(m => m.fixture.id === activeMatch) && (
//           (() => {
//             const match = matches.find(m => m.fixture.id === activeMatch);
//             const odds = getMatchOdds(activeMatch);
            
//             return [
//               <MuiMenuItem key="home" onClick={(e) => {
//                 handleAddToBetSlip(match, 'home', odds?.home);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.home}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="primary"
//                   size="small"
//                   className="text-xs"
//                   startIcon={<Avatar src={match?.teams.home.logo} className="w-3 h-3" />}
//                 >
//                   Win Home @ {odds?.home || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="draw" onClick={(e) => {
//                 handleAddToBetSlip(match, 'draw', odds?.draw);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.draw}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="secondary"
//                   size="small"
//                   className="text-xs"
//                 >
//                   Draw @ {odds?.draw || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="away" onClick={(e) => {
//                 handleAddToBetSlip(match, 'away', odds?.away);
//                 handleMenuClose();
//               }}
//               disabled={!odds?.away}>
//                 <Button 
//                   fullWidth
//                   variant="contained" 
//                   color="error"
//                   size="small"
//                   className="text-xs"
//                   startIcon={<Avatar src={match?.teams.away.logo} className="w-3 h-3" />}
//                 >
//                   Win Away @ {odds?.away || "N/A"}
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="predict" onClick={(e) => {
//                 handlePredictClick(match);
//                 handleMenuClose();
//               }}>
//                 <Button 
//                   fullWidth
//                   variant="outlined" 
//                   color="info"
//                   size="small"
//                   className="text-xs"
//                 >
//                   Predict
//                 </Button>
//               </MuiMenuItem>,
//               <MuiMenuItem key="more" onClick={(e) => {
//                 handleMoreClick(match);
//                 handleMenuClose();
//               }}>
//                 <Button 
//                   fullWidth
//                   variant="outlined" 
//                   color="inherit"
//                   size="small"
//                   className="text-xs"
//                 >
//                   More
//                 </Button>
//               </MuiMenuItem>
//             ]
//           })()
//         )}
//       </Menu>
//     </div>
//   );
// }