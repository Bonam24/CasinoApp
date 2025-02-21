import {AppBar,Toolbar,Typography,Tabs,Tab,Box,Button,useMediaQuery,IconButton,Drawer,List,ListItem,ListItemButton,Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import PaymentGatewaySelector from '../middlepart/paymentGateways/paymentSelection';

export default function Header() {
  const [value, setValue] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const handleWalletDialogOpen = () => {
    setWalletDialogOpen(true);
  };

  const handleWalletDialogClose = () => {
    setWalletDialogOpen(false);
  };

  const isMediumScreen = useMediaQuery('(max-width: 1080px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar sx={{ backgroundColor: '#000000', paddingX: 2, position: 'relative' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: isMediumScreen ? 'space-between' : 'flex-start',
          alignItems: 'center',
          width: '100%',
          flexWrap: isMediumScreen ? 'wrap' : 'nowrap',
          gap: 3, // Adds spacing between elements
        }}
      >
        {/* LEFT SIDE: LOGO & TABS (FOR LARGE SCREENS) */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* LOGO */}
          <Typography variant="h6" sx={{ color: '#13dfae', fontWeight: 'bold' }}>
          Bundlesbets AI Agent
          </Typography>

          {/* TABS (For Large Screens - Above 1080px) */}
          {!isMediumScreen && (
            <Tabs
            value={value}
            onChange={(event, newValue) => {
              if (newValue === 0) {
                window.open("https://bundlesbets.com/", "_blank");
              } else {
                setValue(newValue);
              }
            }}
            textColor="inherit"
            sx={{
              minHeight: 48,
              marginLeft: 2,
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            {['Home', 'Methodology', 'Predictions'].map((label, index) => (
              <Tab
                key={index}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: value === index ? '#13dfae' : 'white',
                      position: 'relative',
                      transition: 'color 0.3s',
                      '&:hover': { color: '#13dfae' },
                      '&:hover::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#13dfae',
                      },
                    }}
                  >
                    {value === index && (
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#13dfae' }} />
                    )}
                    {label}
                  </Box>
                }
              />
            ))}
          </Tabs>
          
          )}
        </Box>

        {/* CONNECT WALLET BUTTON (Visible on medium & large screens) */}
        {!isSmallScreen && (
          <Button
            variant="outlined"
            sx={{
              borderColor: '#13dfae',
              color: '#000000',
              backgroundColor: '#13dfae',
              '&:hover': {
                backgroundColor: '#00cc7a',
                borderColor: '#00cc7a',
              },
            }}
            onClick={handleWalletDialogOpen}
          >
            Connect Wallet
          </Button>
        )}

        {/* HAMBURGER MENU (For Small Screens) */}
        {isSmallScreen && (
          <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} sx={{ ml: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* SECOND ROW: TABS (Only on Medium Screens ≤1080px) */}
      {isMediumScreen && !isSmallScreen && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            sx={{
              minHeight: 48,
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            {['Home', 'Methodology', 'Predictions'].map((label, index) => (
              <Tab
                key={index}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: value === index ? '#13dfae' : 'white',
                      position: 'relative',
                      transition: 'color 0.3s',
                      '&:hover': { color: '#13dfae' },
                      '&:hover::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#13dfae',
                      },
                    }}
                  >
                    {value === index && (
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#13dfae' }} />
                    )}
                    {label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* DRAWER FOR SMALL SCREENS */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }}>
          <List>
            {['Home', 'Methodology', 'Tokenomics', 'Predictions', 'Top Picks'].map((label, index) => (
              <ListItem button key={index} onClick={() => setValue(index)}>
                <ListItemButton>
                  <Typography>{label}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ padding: 2 }}>
            <Button
              variant="outlined"
              sx={{
                width: '100%',
                borderColor: '#13dfae',
                color: '#000000',
                backgroundColor: '#13dfae',
                '&:hover': {
                  backgroundColor: '#00cc7a',
                  borderColor: '#00cc7a',
                },
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        </Box>
      </Drawer>
       {/* Wallet Connection Dialog */}
       <Dialog open={walletDialogOpen} onClose={handleWalletDialogClose}>
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent>
          <Typography>Select your wallet provider to connect:</Typography>
          <PaymentGatewaySelector />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWalletDialogClose} color="error">Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
