import { Box, Typography, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212', // Deep black background
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 -5px 15px rgba(0, 255, 127, 0.4)', // Neon green glow
      }}
    >
      {/* Glowing Border Line */}
      <Box
        sx={{
          height: '3px',
          width: '80%',
          background: 'linear-gradient(90deg, #00ff7f, #43bc93, #00ff7f)',
          margin: '0 auto 20px',
          borderRadius: '5px',
        }}
      />

      {/* Logo & Site Name */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#43bc93',
          textShadow: '0 0 10px #43bc93',
          marginBottom: 1,
        }}
      >
        BUNDLESBET
      </Typography>

      {/* Tagline */}
      <Typography variant="body1" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
        "Your AI-powered gateway to winning predictions!"
      </Typography>

      {/* Social Media Icons */}
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {[{ icon: TwitterIcon, link: '#' }, { icon: FacebookIcon, link: '#' }, { icon: InstagramIcon, link: '#' }].map((item, index) => (
          <IconButton
            key={index}
            href={item.link}
            sx={{
              color: '#43bc93',
              transition: 'transform 0.3s, color 0.3s',
              '&:hover': {
                color: '#00ff7f',
                transform: 'scale(1.2)',
              },
            }}
          >
            <item.icon fontSize="large" />
          </IconButton>
        ))}
      </Box>

      {/* Bottom Line */}
      <Box sx={{ marginTop: 2, fontSize: '0.9rem', opacity: 0.6 }}>
        &copy; {new Date().getFullYear()} BundlesBet. All Rights Reserved.
      </Box>
    </Box>
  );
}
