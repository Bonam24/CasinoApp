import { Box, TextField, Typography } from '@mui/material';

export default function SearchBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack text and search bar vertically
        alignItems: 'center',
        padding: 2,
        width: '100%',
        marginTop: 3,
        marginBottom: 7,
      }}
    >
      {/* Search Label with Gradient Text */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          marginBottom: 1, // Spacing between text and search bar
          background: 'linear-gradient(90deg, #13dfae, #00ff7f)', // Gradient color
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', // Makes the gradient apply to text
          fontSize: { xs: '1rem', sm: '1.5rem' }, // Responsive font size
          textTransform: 'uppercase', // Makes text look bold and stylish
          letterSpacing: '1px', // Slight spacing for better readability
        }}
      >
        Search for a sport
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search for sports predictions..."
        sx={{
          width: '100%',
          maxWidth: '800px', // Increased width for a longer search bar
          borderRadius: '50px', // Rounded corners
          backgroundColor: '#1d1d1d', // Dark background for the search field
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px', // Match the radius for the border
            '& fieldset': {
              borderColor: '#43bc93', // Default green border
            },
            '&:hover fieldset': {
              borderColor: '#00ff7f', // Brighter green on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff7f', // Focused field glowing green
              boxShadow: '0 0 10px 2px #00ff7f', // Glow effect when focused
            },
            '& input::placeholder': {
              color: 'white', // Set placeholder text color to white
            },
          },
        }}
      />
    </Box>
  );
}
