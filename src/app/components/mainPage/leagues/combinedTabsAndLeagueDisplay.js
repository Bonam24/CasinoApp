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
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  const sportsData = [
    { 
      name: 'Football', 
      leagues: [
        {
            "name": "Premier League",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=39"
          },
          {
            "name": "La Liga",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=140"
          },
          {
            "name": "Serie A",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=135"
          },
          {
            "name": "Bundesliga",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=78"
          },
          {
            "name": "Ligue 1",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=61"
          },
          {
            "name": "Eredivisie",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=88"
          },
          {
            "name": "Primeira Liga",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=94"
          },
          {
            "name": "MLS",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=253"
          },
          {
            "name": "UEFA Champions League",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=2"
          },
          {
            "name": "Europa League",
            "endpoint": "https://v3.football.api-sports.io/leagues?id=3"
          },
      ] 
    },
    { 
      name: 'Hockey', 
      leagues: [
        { "name": 'NHL', "endpoint": 'https://v1.hockey.api-sports.io/leagues?id=57' },
      ] 
    },
    { 
      name: 'Baseball', 
      leagues: [
        { name: 'MLB', endpoint: 'https://v1.baseball.api-sports.io/leagues?id=1' },
      ] 
    },
    { 
      name: 'Golf', 
      leagues: [
        { name: 'PGA Tour', endpoint: 'https://v1.golf.api-sports.io/leagues?id=1' },
      ] 
    },
    { 
      name: 'Formula 1', 
      leagues: [
        { "name": 'F1 World Championship', "endpoint": 'https://v1.formula1.api-sports.io/leagues?id=1' },
      ] 
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchLeagues(sportsData[newValue].leagues);
  };

  const fetchLeagues = async (leagueEndpoints) => {
    setLoading(true);
    try {
      const leaguePromises = leagueEndpoints.map(async (league) => {
        const response = await fetch(league.endpoint, {
          headers: {
            'x-apisports-key': 'aa2a46cd86fefe10bf10a5358b1769a3',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${league.name}`);
        }

        const data = await response.json();
        return data.response ? data.response[0] : null;
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
                minWidth: isSmallScreen ? '60px' : '80px',
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
              {leagues.map((league, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
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
                        backgroundColor: '#f5f5f5',
                      }}
                      image={league.league.logo}
                      alt={league.league.name}
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
                        {league.league.name}
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