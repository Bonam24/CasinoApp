// components/MobileMenu.js
import { MenuItem as MuiMenuItem, Button, Avatar,Menu } from "@mui/material";

export default function MobileMenu({ 
  anchorEl, 
  handleMenuClose, 
  activeMatch, 
  matches, 
  handleAddToBetSlip, 
  generateRandomOdds,
  handlePredictClick,
  handleMoreClick
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          backgroundColor: '#1F2937',
          color: 'white',
        },
      }}
    >
      {activeMatch && matches.find(m => m.fixture.id === activeMatch) && (
        [
          <MuiMenuItem key="home" onClick={(e) => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            handleAddToBetSlip(match, 'home', generateRandomOdds());
            handleMenuClose();
          }}>
            <Button 
              fullWidth
              variant="contained" 
              color="primary"
              size="small"
              className="text-xs"
              startIcon={<Avatar src={matches.find(m => m.fixture.id === activeMatch)?.teams.home.logo} className="w-3 h-3" />}
            >
              Win Home
            </Button>
          </MuiMenuItem>,
          <MuiMenuItem key="draw" onClick={(e) => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            handleAddToBetSlip(match, 'draw', generateRandomOdds());
            handleMenuClose();
          }}>
            <Button 
              fullWidth
              variant="contained" 
              color="secondary"
              size="small"
              className="text-xs"
            >
              Draw
            </Button>
          </MuiMenuItem>,
          <MuiMenuItem key="away" onClick={(e) => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            handleAddToBetSlip(match, 'away', generateRandomOdds());
            handleMenuClose();
          }}>
            <Button 
              fullWidth
              variant="contained" 
              color="error"
              size="small"
              className="text-xs"
              startIcon={<Avatar src={matches.find(m => m.fixture.id === activeMatch)?.teams.away.logo} className="w-3 h-3" />}
            >
              Win Away
            </Button>
          </MuiMenuItem>,
          <MuiMenuItem key="predict" onClick={(e) => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            handlePredictClick(match);
            handleMenuClose();
          }}>
            <Button 
              fullWidth
              variant="outlined" 
              color="info"
              size="small"
              className="text-xs"
            >
              Predict
            </Button>
          </MuiMenuItem>,
          <MuiMenuItem key="more" onClick={(e) => {
            const match = matches.find(m => m.fixture.id === activeMatch);
            handleMoreClick(match);
            handleMenuClose();
          }}>
            <Button 
              fullWidth
              variant="outlined" 
              color="inherit"
              size="small"
              className="text-xs"
            >
              More
            </Button>
          </MuiMenuItem>
        ]
      )}
    </Menu>
  );
}