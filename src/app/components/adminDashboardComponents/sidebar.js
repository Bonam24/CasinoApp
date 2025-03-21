// components/Sidebar.js
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* Adds spacing below the AppBar */}
      <List>
        {['Dashboard', 'Users', 'Bets', 'Revenue'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 ? <BarChartIcon /> : index === 1 ? <PeopleIcon /> : <InboxIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;