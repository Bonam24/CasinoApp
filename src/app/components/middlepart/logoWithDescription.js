import { Box, Typography, Button } from '@mui/material';
const BundlesBetphoneimg = '/images/bundlesbetphoneimg.png'; // Your image path

export default function WelcomeSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Column for small screens, row for larger
        alignItems: 'center', // Center elements
        justifyContent: 'center', // Center content
        padding: { xs: 2, sm: 4 },
        backgroundColor: 'black',
        borderRadius: 2,
        marginTop: '3em',
        borderBottom: '5px solid #13dfae', // Bottom border
        gap: { xs: 2, sm: 5 }, // Adjust spacing between text and image
      }}
    >
      {/* Left Side: Text */}
      <Box
        sx={{
          maxWidth: { xs: '100%', sm: '50%' }, // Text takes half width on large screens
          paddingLeft: { xs: 0, sm: '2em' }, // Moves text inward
          textAlign: { xs: 'center', sm: 'left' }, // Center text on smaller screens
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#13dfae',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '3.5rem' }, // Reduced font size for smaller screens
            marginBottom: 0.5,
          }}
        >
          Welcome to
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: '#13dfae',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem' }, // Reduced font size for smaller screens
            textTransform: 'uppercase',
            marginBottom: 1,
          }}
        >
          BUNDLESBET
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: '#9e9e9e',
            fontSize: { xs: '0.8rem', sm: '1.5rem' }, // Reduced font size for smaller screens
            fontStyle: 'italic',
            marginBottom: 0.5,
          }}
        >
          AI Powered
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#9e9e9e',
            fontSize: { xs: '0.8rem', sm: '1.5rem' }, // Reduced font size for smaller screens
            fontStyle: 'italic',
            marginBottom: 2,
          }}
        >
          WEB3 Prediction Platform
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#13dfae',
              color: 'white',
              '&:hover': { backgroundColor: '#00ff7f' },
              fontSize: { xs: '0.8rem', sm: '1rem' },
              padding: '8px 16px',
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#13dfae',
              color: '#13dfae',
              '&:hover': { backgroundColor: '#13dfae', color: 'white' },
              fontSize: { xs: '0.8rem', sm: '0.8rem' },
              padding: '8px 16px',
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Right Side: Centered Image */}
      <Box
        component="img"
        src={BundlesBetphoneimg} // Replace with your actual image path
        alt="BundlesBet Logo"
        sx={{
          width: { xs: '70%', sm: '50%' }, // Centers and resizes image
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
