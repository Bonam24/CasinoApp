// components/Layout.js
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './sidebar';
import Header from './header';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Adds spacing below the AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;