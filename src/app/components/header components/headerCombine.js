import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button, useMediaQuery } from '@mui/material';
import { useState } from 'react';

export default function Header() {
  const [value, setValue] = useState(0);
  const isMediumScreen = useMediaQuery('(max-width: 960px)'); // Tabs go down at ≤ 700px

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBar
      sx={{
        backgroundColor: '#000000',
        paddingX: 2,
        marginTop: 0, // No margin at the top to make the header stick to the top
      }}
    >
      {/* FIRST ROW: LOGO, TABS & CONNECT WALLET (Tabs go down at ≤ 700px) */}
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: isMediumScreen ? 'wrap' : 'nowrap', // Tabs move below at ≤ 700px
        }}
      >
        {/* LEFT SIDE: LOGO & TABS */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: isMediumScreen ? 'wrap' : 'nowrap',
          }}
        >
          {/* LOGO */}
          <Typography variant="h6" sx={{ color: '#43bc93', marginRight: 3, fontWeight: 'bold' }}>
            BundlesBet
          </Typography>

          {/* TABS (Move below at ≤ 700px) */}
          {!isMediumScreen && (
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              sx={{
                minHeight: 48,
                '& .MuiTabs-indicator': { display: 'none' }, // Hide default indicator
              }}
            >
              {[
                { label: 'Home', href: '/' },
                { label: 'Methodology', href: '#' },
                { label: 'Tokenomics', href: '#' },
                { label: 'Predictions', href: '#' },
                { label: 'Top Picks', href: '#' },
              ].map((item, index) => (
                <Tab
                  key={index}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: value === index ? '#43bc93' : 'white', // White default, neon green when active
                        position: 'relative',
                        transition: 'color 0.3s',
                        '&:hover': { color: '#43bc93' }, // Change to neon green on hover
                        '&:hover::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#43bc93',
                        },
                      }}
                    >
                      {value === index && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#43bc93',
                          }}
                        />
                      )}
                      {item.label}
                    </Box>
                  }
                  component="a"
                  href={item.href}
                />
              ))}
            </Tabs>
          )}
        </Box>

        {/* RIGHT SIDE: CONNECT WALLET BUTTON */}
        <Button
          variant="outlined"
          sx={{
            borderColor: '#43bc93',
            color: '#000000',
            backgroundColor: '#43bc93',
            '&:hover': {
              backgroundColor: '#00cc7a', // Darker green on hover
              borderColor: '#00cc7a',
            },
          }}
        >
          Connect Wallet
        </Button>
      </Toolbar>

      {/* SEPARATE TABS ROW ON SMALL SCREENS (Move down at ≤ 700px) */}
      {isMediumScreen && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginTop: 1,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            sx={{
              minHeight: 48,
              '& .MuiTabs-indicator': { display: 'none' }, // Hide default indicator
            }}
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'Methodology', href: '#' },
              { label: 'Tokenomics', href: '#' },
              { label: 'Predictions', href: '#' },
              { label: 'Top Picks', href: '#' },
            ].map((item, index) => (
              <Tab
                key={index}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: value === index ? '#43bc93' : 'white', // White default, neon green when active
                      position: 'relative',
                      transition: 'color 0.3s',
                      '&:hover': { color: '#43bc93' }, // Change to neon green on hover
                      '&:hover::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#43bc93',
                      },
                    }}
                  >
                    {value === index && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#43bc93',
                        }}
                      />
                    )}
                    {item.label}
                  </Box>
                }
                component="a"
                href={item.href}
              />
            ))}
          </Tabs>
        </Box>
      )}
    </AppBar>
  );
}
