import Image from 'next/image';
import { Card, CardMedia, CardContent, Typography, Box, Grid } from '@mui/material';

const leagues = [
  { name: 'English Premier League', image_url: '/images/premierleague.jpg' },
  { name: 'La Liga', image_url: '/images/laliga.png' },
  { name: 'Serie A', image_url: '/images/seriea.jpg' },
  { name: 'Bundesliga', image_url: '/images/bundesliga.jpg' },
  { name: 'Ligue 1', image_url: '/images/league1.png' },
  { name: 'Eredivisie', image_url: '/images/eredivisie.png' },
  { name: 'NCAA', image_url: '/images/ncaa-basketball.svg' },
  { name: 'Portuguese league', image_url: '/images/portugal.png' },
  { name: 'UEFA Champions League', image_url: '/images/uefa.jpg' },
  { name: 'WNBA', image_url: '/images/wnba.svg' },
];

export default function LeagueGrid() {
  return (
    <Box sx={{ width: '100%', py: 6, backgroundColor: 'black', textAlign: 'center' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          background: 'linear-gradient(to right, #00ff87, #60efff)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          fontWeight: 'bold', 
          mb: 4,
          fontFamily: 'Poppins, sans-serif',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Responsive font size
        }}
      >
        Our Leagues
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ px: 2 }}>
        {leagues.map((league, index) => (
          <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
            <Card 
              sx={{ 
                boxShadow: 6, 
                borderRadius: 2, 
                overflow: 'hidden', 
                boxShadow: '0 8px 24px rgba(0, 255, 135, 0.3)',
                textAlign: 'center', 
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(0, 255, 135, 0.3)',
                },
                backgroundColor: 'black',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardMedia
                component="img"
                image={league.image_url}
                alt={league.name}
                sx={{ 
                  width: '100%', 
                  height: { xs: '80px', sm: '100px', md: '150px' }, // Responsive height
                  objectFit: 'contain', 
                  p: { xs: 1, sm: 2 }, // Responsive padding
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              />
              <CardContent sx={{ backgroundColor: '#223', p: { xs: 1, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  align="center" 
                  fontWeight="bold" 
                  sx={{ 
                    color: 'white', 
                    fontFamily: 'Poppins, sans-serif',
                    background: 'linear-gradient(to right, #00ff87, #60efff)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } // Responsive font size
                  }}
                >
                  {league.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}