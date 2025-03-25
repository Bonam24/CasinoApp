import React from 'react';
import { 
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Container,
  useTheme
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
        <Box sx={{ p: 3 }}>
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

export default function SportsTabs() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const sports = [
    { name: 'Golf', content: '' },
    { name: 'Hockey', content: '' },
    { name: 'Baseball', content: '' },
    { name: 'Football', content: '' },
    { name: 'Formula 1', content: '' },
    { name: 'Basketball', content: '' },
    { name: 'NBA', content: '' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6, backgroundColor: '#000' }}>
      <Typography 
        variant="h4" 
        component="h2" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          mb: 6,
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
        mb: 4
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            width: 'fit-content',
            backgroundColor: '#223',
            borderRadius: '8px',
            px: 2
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
              '& .MuiTabs-indicator': {
                backgroundColor: '#13dfae',
                height: 3
              },
              '& .MuiTab-root': {
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.95rem',
                textTransform: 'none',
                minWidth: 90,
                '&.Mui-selected': {
                  color: '#13dfae',
                },
                '&:hover': {
                  color: '#13dfae',
                }
              }
            }}
          >
            {sports.map((sport, index) => (
              <Tab 
                key={sport.name} 
                label={sport.name} 
                {...a11yProps(index)} 
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {sports.map((sport, index) => (
        <TabPanel key={sport.name} value={value} index={index}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            backgroundColor: 'transparent',
            borderRadius: '8px'
          }}>
            {/* Content would go here */}
          </Paper>
        </TabPanel>
      ))}
    </Container>
  );
}