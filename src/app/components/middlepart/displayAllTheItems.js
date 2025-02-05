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
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center', // Center items horizontally
        backgroundColor: '#000',
        marginLeft: "2%",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: 'calc(45.00% - 16px)',  
              sm: 'calc(25% - 16px)',      
              md: 'calc(20% - 16px)',      
            },
            marginBottom: 2, 
          }}
        >
          <IndividualItem abbreviation={item.title} name={item.description} />
        </Box>
      ))}
    </Box>
  );
}
