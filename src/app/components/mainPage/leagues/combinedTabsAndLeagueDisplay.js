import React, { useEffect, useState } from 'react';
import { 
  Box, Tab, Tabs, Typography, Paper, Container, Grid, 
  Card, CardMedia, CardContent, CircularProgress, useMediaQuery 
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
        { name: 'Premier League', id: 39, sport: 'football' },
        { name: 'La Liga', id: 140, sport: 'football' },
        { name: 'Serie A', id: 135, sport: 'football' },
        { name: 'Bundesliga', id: 78, sport: 'football' },
        { name: 'Ligue 1', id: 61, sport: 'football' },
        { name: 'UEFA Champions League', id: 2, sport: 'football' },
        { name: "Primeira Liga", id: 94, sport: 'football' },
        { name: "MLS", id: 253, sport: 'football' },
        { name: "Eredivisie", id: 88, sport: 'football' },
        { name: "Europa league", id: 3, sport: 'football' },
      ] 
    },
    { 
      name: 'Hockey', 
      leagues: [
        { name: 'AHL', id: 58, sport: 'hockey' },
        { name: 'CHL', id: 125, sport: 'hockey' },
        { name: 'ECHL', id: 59, sport: 'hockey' },
        { name: 'FHL', id: 61, sport: 'hockey' },
        { name: 'FPHL', id: 260, sport: 'hockey' },
        { name: 'NCAA', id: 256, sport: 'hockey' },
        { name: 'NHL', id: 57, sport: 'hockey' },
        { name: 'SPHL', id: 60, sport: 'hockey' },
        { name: 'USHL', id: 62, sport: 'hockey' },
      ] 
    },
    { 
      name: 'Baseball', 
      leagues: [
        { name: 'FL', id: 67, sport: 'baseball' },
        { name: 'IL', id: 3, sport: 'baseball' },
        { name: 'MLB', id: 1, sport: 'baseball' },
        { name: 'MLB_Spring Training', id: 71, sport: 'baseball' },
        { name: 'PCL', id: 4, sport: 'baseball' },
        { name: 'Triple A-East', id: 60, sport: 'baseball' },
        { name: 'Triple A national Championship', id: 33, sport: 'baseball' },
        { name: 'Triple A West', id: 61, sport: 'baseball' },
      ] 
    },
    { 
      name: 'BasketBall', 
      leagues: [
        { name: 'NBA', id: 12, sport: 'basketball' },
        { name: 'NBA G-League', id: 20, sport: 'basketball' },
        { name: 'NBA Sacramento Summer league', id: 21, sport: 'basketball' },
        { name: 'NBA Cup', id: 422, sport: 'basketball' },
        { name: 'NCAA', id: 116, sport: 'basketball' },
      ] 
    },
    { 
      name: 'Formula 1', 
      leagues: [
        { name: 'F1 World Championship', id: 1, sport: 'formula-1' },
      ] 
    },
    { 
      name: 'Rugby', 
      leagues: [
        { name: 'Major League Rugby', id: 44, sport: 'rugby' },
        { name: 'Pro Rugby', id: 43, sport: 'rugby' },
      ] 
    },
    { 
      name: 'AFL', 
      leagues: [
        { name: 'AFL Premiership', id: 1, sport: 'afl' },
      ] 
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchLeagues(sportsData[newValue].leagues);
  };

  const getLeagueLogo = (leagueData, leagueName) => {
    if (leagueData.league?.logo) return leagueData.league.logo;
    if (leagueData.logo) return leagueData.logo;
    if (leagueData.flag) return leagueData.flag;
    
    const initials = leagueName.split(' ').map(word => word[0]).join('');
    return `https://via.placeholder.com/150/223/13dfae?text=${initials}`;
  };

  const fetchLeagues = async (leagues) => {
    setLoading(true);
    try {
      const leaguePromises = leagues.map(async (league) => {
        try {
          const response = await fetch(`/api/fetchGames/displayLeagues?id=${league.id}&sport=${league.sport}`);
          
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