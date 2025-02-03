import { Box } from '@mui/material';
import IndividualItem from './individualItem';

const items = [
    { title: 'English Premier League', description: 'Top-tier football league in England.' },
    { title: 'La Liga', description: 'Spain’s premier football competition.' },
    { title: 'Bundesliga', description: 'Germany’s elite football league.' },
    { title: 'Serie A', description: 'Italy’s top professional football league.' },
    { title: 'Ligue 1', description: 'France’s premier football division.' },
    { title: 'UEFA Champions League', description: 'Europe’s most prestigious club tournament.' },
    { title: 'NBA', description: 'World’s biggest basketball league.' },
    { title: 'NFL', description: 'Top professional American football league.' },
    { title: 'MLB', description: 'Major League Baseball in North America.' },
    { title: 'NHL', description: 'Premier ice hockey league in North America.' },
  ];
  

export default function App() {
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexWrap: 'wrap', // Ensure items wrap to the next line
        gap: 2, // Ensure there is space between the items, so they don't touch
      }}
    >
      {/* Map through the items array and render IndividualItem for each item */}
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: 'calc(33.33% - 16px)',  // 3 items per row for extra small screens
              sm: 'calc(25% - 16px)',      // 4 items per row for small screens (tablets)
              md: 'calc(20% - 16px)',      // 5 items per row for medium and larger screens (desktops)
            },
            marginBottom: 2, // Add margin at the bottom of each item
          }}
        >
          <IndividualItem abbreviation={item.title} name={item.description} />
        </Box>
      ))}
    </Box>
  );
}
