export const sportsData = [
    { 
      name: 'Football', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'Premier League', endpoint: 'https://v3.football.api-sports.io/leagues?id=39', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=39' },
        { name: 'La Liga', endpoint: 'https://v3.football.api-sports.io/leagues?id=140', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=140' },
        { name: 'Serie A', endpoint: 'https://v3.football.api-sports.io/leagues?id=135', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=135' },
        { name: 'Bundesliga', endpoint: 'https://v3.football.api-sports.io/leagues?id=78', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=78' },
        { name: 'Ligue 1', endpoint: 'https://v3.football.api-sports.io/leagues?id=61', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=61' },
        { name: 'UEFA Champions League', endpoint: 'https://v3.football.api-sports.io/leagues?id=2', oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=2' },
        { name: "Primeira Liga", endpoint: "https://v3.football.api-sports.io/leagues?id=94", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=94' },
        { name: "MLS", endpoint: "https://v3.football.api-sports.io/leagues?id=253", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=253' },
        { name: "Eredivisie", endpoint: "https://v3.football.api-sports.io/leagues?id=88", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=88' },
        { name: "Europa league", endpoint: "https://v3.football.api-sports.io/leagues?id=3", oddsEndpoint: 'https://v3.football.api-sports.io/odds?season=2024&league=3' },
      ] 
    },
    { 
      name: 'Hockey', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'AHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=58&season=2024', oddsEndpoint:"https://v1.hockey.api-sports.io/odds?season=2024&league=58"},
        { name: 'CHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=125&season=2024'},
        { name: 'ECHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=59&season=2024'},
        { name: 'FHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=61&season=2024'},
        { name: 'FPHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=260&season=2024'},
        { name: 'NCAA', endpoint: 'https://v1.hockey.api-sports.io/games?league=256&season=2024'},
        { name: 'NHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=57&season=2024'},
        { name: 'SPHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=60&season=2024'},
        { name: 'USHL', endpoint: 'https://v1.hockey.api-sports.io/games?league=62&season=2024'},
      ] 
    },
    { 
      name: 'Baseball', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'FL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=67' },
        { name: 'IL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=3' },
        { name: 'MLB', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=1' },
        { name: 'MLB_Spring Training', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=71' },
        { name: 'PCL', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=4' },
        { name: 'Triple A-East', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=60' },
        { name: 'Triple A national Championship', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=33' },
        { name: 'Triple A West', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=61' },
      ] 
    },
    { 
      name: 'BasketBall', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'NBA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=12',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=12&season=2024-2025" },
        { name: 'NBA G-League', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=20', oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=20&season=2024-2025" },
        { name: 'NBA Sacramento Summer league', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=21',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=21&season=2024-2025" },
        { name: 'NBA Cup', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=422',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=422&season=2024-2025" },
        { name: 'NCAA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=116',oddsEndpoint:"https://v1.basketball.api-sports.io/odds?league=166&season=2024-2025" },
      ] 
    },
    { 
      name: 'Formula 1', 
      component: 'IndividualSportMatches',
      leagues: [
        { name: 'F1 World Championship', endpoint: 'https://v1.formula-1.api-sports.io/leagues?id=1' },
      ] 
    },
    { 
      name: 'Rugby', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'Major League Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=44' },
        { name: 'Pro Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=43' },
      ] 
    },
    { 
      name: 'AFL', 
      component: 'TeamSportMatches',
      leagues: [
        { name: 'AFL Premiership', endpoint: 'https://v1.afl.api-sports.io/leagues?id=1' },
      ] 
    },
  ];
  
  export const API_BASE_URLS = {
    football: 'https://v3.football.api-sports.io',
    hockey: 'https://v1.hockey.api-sports.io',
    basketball: 'https://v1.basketball.api-sports.io',
    baseball: 'https://v1.baseball.api-sports.io',
    rugby: 'https://v1.rugby.api-sports.io',
    afl: 'https://v1.afl.api-sports.io',
    formula1: 'https://v1.formula-1.api-sports.io'
  };