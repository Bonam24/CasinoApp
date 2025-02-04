import { Box, Typography, Button } from '@mui/material';

export default function LeagueCard({ abbreviation, name }) {
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 170, md: 220 }, // Responsive width: full width on small screens, 200px on small screens, and 250px on medium screens
        height: '15em',
        backgroundColor: '#1d1d1d',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 2,
        boxShadow: '0 0 10px 2px rgba(0, 255, 127, 0.5)',
        '&:hover': {
          backgroundColor: '#333333',
        },
        marginBottom: 2,
      }}
    >
      {/* League Abbreviation */}
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: { xs: '1.2rem', sm: '1.5rem' }, // Smaller font size on smaller screens
          marginBottom: 1,
        }}
      >
        {abbreviation}
      </Typography>

      {/* League Name */}
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          fontSize: { xs: '0.5rem', sm: '0.9rem' }, // Adjust font size for different screen sizes
          marginBottom: 2,
        }}
      >
        {name}
      </Typography>

      {/* View Predictions Button */}
      <Button
  variant="contained"
  sx={{
    backgroundColor: '#43bc93',
    color: 'white',
    '&:hover': {
      backgroundColor: '#00ff7f',
    },
    padding: { xs: '4px 6px', sm: '6px 10px' }, // Responsive padding
    fontSize: { xs: '0.6rem', sm: '0.8rem', md: '0.9rem' }, // Font size reduces on smaller screens
    minWidth: { xs: '70px', sm: '90px' }, // Keeps button width proportionate
    borderRadius: 1.5, // Slightly rounded corners
    textTransform: 'none', // Keeps text readable without all caps
  }}
>
  View Predictions
</Button>


    </Box>
  );
}
