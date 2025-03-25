import React, { useEffect, useState } from 'react';
import { 
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import PropTypes from 'prop-types';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SportsLeaguesCombined = () => {
  const [value, setValue] = React.useState(0);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const sportsData = [
    { 
      name: 'Football', 
      leagues: [
        { name: 'Premier League', endpoint: 'https://v3.football.api-sports.io/leagues?id=39' },
        { name: 'La Liga', endpoint: 'https://v3.football.api-sports.io/leagues?id=140' },
        { name: 'Serie A', endpoint: 'https://v3.football.api-sports.io/leagues?id=135' },
        { name: 'Bundesliga', endpoint: 'https://v3.football.api-sports.io/leagues?id=78' },
        { name: 'Ligue 1', endpoint: 'https://v3.football.api-sports.io/leagues?id=61' },
        { name: 'UEFA Champions League', endpoint: 'https://v3.football.api-sports.io/leagues?id=2' },
        {
          name: "Primeira Liga",
          endpoint: "https://v3.football.api-sports.io/leagues?id=94"
        },
        {
          name: "MLS",
          endpoint: "https://v3.football.api-sports.io/leagues?id=253"
        },
        {
          name: "Eredivisie",
        endpoint: "https://v3.football.api-sports.io/leagues?id=88"
        },
        {
          name: "Europa league",
        endpoint: "https://v3.football.api-sports.io/leagues?id=3"
        },
      ] 
    },
    { 
      name: 'Hockey', 
      leagues: [
        { name: 'AHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=58'},
        { name: 'CHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=125'},
        { name: 'ECHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=59'},
        { name: 'FHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=61'},
        { name: 'FPHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=260'},
        { name: 'NCAA', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=256'},
        { name: 'NHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=57'},
        { name: 'SPHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=60'},
        { name: 'USHL', endpoint: 'https://v1.hockey.api-sports.io/leagues?id=62'},
      ] 
    },
    { 
      name: 'Baseball', 
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
      leagues: [
        { name: 'NBA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=12' },
        { name: 'NBA G-League', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=20' },
        { name: 'NBA Sacramento Summer league', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=21' },
        { name: 'NBA Cup', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=422' },
        { name: 'NCAA', endpoint: 'https://v1.basketball.api-sports.io/leagues?id=116' },
      ] 
    },
    { 
      name: 'Formula 1', 
      leagues: [
        { name: 'F1 World Championship', endpoint: 'https://v1.formula-1.api-sports.io/leagues?id=1' },
      ] 
    },
    { 
      name: 'Rugby', 
      leagues: [
        { name: 'Major League Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=44' },
        { name: 'Pro Rugby', endpoint: 'https://v1.rugby.api-sports.io/leagues?id=43' },
      ] 
    },
    { 
      name: 'AFL', 
      leagues: [
        { name: 'AFL Premiership', endpoint: 'https://v1.afl.api-sports.io/leagues?id=1' },
      ] 
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchLeagues(sportsData[newValue].leagues);
  };

  const getLeagueLogo = (leagueData, leagueName) => {
    // Try different possible logo paths
    if (leagueData.league?.logo) return leagueData.league.logo;
    if (leagueData.logo) return leagueData.logo;
    if (leagueData.flag) return leagueData.flag;
    
    // Fallback to placeholder with league initials
    const initials = leagueName.split(' ').map(word => word[0]).join('');
    return `https://via.placeholder.com/150/223/13dfae?text=${initials}`;
  };

  const fetchLeagues = async (leagueEndpoints) => {
    setLoading(true);
    try {
      const leaguePromises = leagueEndpoints.map(async (league) => {
        try {
          const response = await fetch(league.endpoint, {
            headers: {
              'x-apisports-key': 'aa2a46cd86fefe10bf10a5358b1769a3',
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${league.name}`);
          }

          const data = await response.json();
          if (!data.response || data.response.length === 0) return null;
          
          const leagueData = data.response[0];
          
          return {
            id: leagueData.league?.id || leagueData.id || Math.random().toString(36).substr(2, 9),
            name: leagueData.league?.name || leagueData.name || league.name,
            logo: getLeagueLogo(leagueData, league.name),
            originalData: leagueData
          };
        } catch (err) {
          console.error(`Error fetching ${league.name}:`, err);
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: league.name,
            logo: `https://via.placeholder.com/150/223/13dfae?text=${league.name.substring(0, 2)}`,
            error: err.message
          };
        }
      });

      const leagueResults = await Promise.all(leaguePromises);
      setLeagues(leagueResults.filter(league => league !== null));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues(sportsData[0].leagues);
  }, []);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 6 }, backgroundColor: '#000' }}>
      <Typography 
        variant={isSmallScreen ? "h5" : "h4"}
        component="h2" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          mb: { xs: 3, sm: 6 },
          color: '#13dfae',
          letterSpacing: 1,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        SPORTS COVERAGE
      </Typography>
      
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mb: { xs: 2, sm: 4 },
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            width: 'fit-content',
            backgroundColor: '#223',
            borderRadius: '8px',
            px: 1
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="#fff"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="sports tabs"
            sx={{
              minHeight: '48px',
              '& .MuiTabs-indicator': {
                backgroundColor: '#13dfae',
                height: 3
              },
              '& .MuiTab-root': {
                color: '#fff',
                fontWeight: 500,
                fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                textTransform: 'none',
                minWidth: isSmallScreen ? '20px' : '80px',
                px: isSmallScreen ? 1 : 2,
                py: 1,
                '&.Mui-selected': {
                  color: '#13dfae',
                },
                '&:hover': {
                  color: '#13dfae',
                }
              }
            }}
          >
            {sportsData.map((sport, index) => (
              <Tab 
                key={sport.name} 
                label={sport.name} 
                {...a11yProps(index)} 
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      <TabPanel value={value} index={value}>
        <Paper elevation={0} sx={{ 
          p: { xs: 1, sm: 3 }, 
          backgroundColor: 'transparent',
          borderRadius: '8px'
        }}>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#13dfae',
              mb: { xs: 2, sm: 4 },
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {sportsData[value].name} Leagues
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={isSmallScreen ? 1 : 2} justifyContent="center">
              {leagues.map((league) => (
                <Grid item xs={6} sm={4} md={3} key={league.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: '1px solid transparent',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        borderColor: '#13dfae',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: isSmallScreen ? '70px' : '100px',
                        objectFit: 'contain',
                        p: isSmallScreen ? 0.5 : 1.5,
                        backgroundColor: '#e1f7e7',
                      }}
                      image={league.logo}
                      alt={league.name}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/150/223/13dfae?text=${league.name.substring(0, 2)}`;
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        p: isSmallScreen ? '8px' : '12px',
                        backgroundColor: '#223',
                      }}
                    >
                      <Typography
                        variant={isSmallScreen ? "caption" : "body2"}
                        sx={{
                          fontWeight: 'bold',
                          color: '#13dfae',
                          textTransform: 'uppercase',
                          fontSize: isSmallScreen ? '0.6rem' : '0.75rem',
                          lineHeight: 1.2
                        }}
                      >
                        {league.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default SportsLeaguesCombined;