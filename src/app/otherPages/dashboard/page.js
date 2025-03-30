"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  SportsSoccer,
  MonetizationOn,
  TrendingUp,
  Notifications,
  AccountBalanceWallet,
  ExitToApp,
  Menu as MenuIcon,
  Sports,
  Payment,
  EmojiEvents,
  AddCircleOutline,
  History,
  AccountBalance,
  LocalAtm,
  Redeem,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {logout} from '../../../../authentication/authenticate'
import { useRouter } from "next/navigation";
import { getDatabase, ref, get } from "firebase/database";
import { auth, database } from "../../../../firebaseConfig"; // Import Firebase auth instance
import { onAuthStateChanged } from "firebase/auth"; 


// Custom styled components
const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#1a1a1a", // Dark gray background for cards
  color: "#ffffff", // White text
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
  },
}));

const StatsPaper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#234", // Darker gray for stats cards
  color: "#ffffff", // White text
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
  },
}));

const CustomButton = styled(Button)({
  backgroundColor: "#14b8a6", // Primary teal-green
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0c8a6a", // Slightly darker teal-green on hover
  },
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "16px",
  textTransform: "none",
  width: "100%", // Full width
});

const RecentActivityItem = styled(ListItem)({
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#223", // Darker gray on hover
  },
});

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For the menu dropdown
  const [selectedWeek, setSelectedWeek] = useState("thisWeek"); // For week selection
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [balance, setBalance] = useState(0); // State to store the user's balance
  const open = Boolean(anchorEl);
  const router = useRouter();

   // Fetch user profile data on component mount
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        fetchUserProfile(user.uid); // Fetch user profile data
      } else {
        // User is signed out
        setUserName("Guest"); // Reset to default
        setBalance(0); // Reset to default
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch user profile data from Realtime Database
  const fetchUserProfile = async (userId) => {
    const database = getDatabase(); // Initialize Realtime Database
    const userRef = ref(database, `profiles/${userId}`); // Reference to the user's profile

    try {
      const snapshot = await get(userRef); // Fetch data from the database
      if (snapshot.exists()) {
        const profileData = snapshot.val(); // Get the profile data
        setUserName(profileData.firstName || "Guest"); // Set the user's name
        setBalance(profileData.balance || 0); // Set the user's balance
      } else {
        console.log("No profile data found for this user.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout(); // Call the logout function
    router.push("/otherPages/loginPage");
  };

  // Sample data for the bar chart (for different weeks)
  const weeklyData = {
    thisWeek: [
      { name: "Mon", bets: 40, wins: 24 },
      { name: "Tue", bets: 30, wins: 13 },
      { name: "Wed", bets: 20, wins: 18 },
      { name: "Thu", bets: 27, wins: 19 },
      { name: "Fri", bets: 50, wins: 38 },
      { name: "Sat", bets: 60, wins: 48 },
      { name: "Sun", bets: 70, wins: 58 },
    ],
    feb23_27: [
      { name: "Mon", bets: 50, wins: 30 },
      { name: "Tue", bets: 35, wins: 20 },
      { name: "Wed", bets: 25, wins: 15 },
      { name: "Thu", bets: 40, wins: 25 },
      { name: "Fri", bets: 60, wins: 45 },
      { name: "Sat", bets: 70, wins: 55 },
      { name: "Sun", bets: 80, wins: 65 },
    ],
    feb16_20: [
      { name: "Mon", bets: 45, wins: 30 },
      { name: "Tue", bets: 32, wins: 18 },
      { name: "Wed", bets: 22, wins: 14 },
      { name: "Thu", bets: 35, wins: 22 },
      { name: "Fri", bets: 55, wins: 40 },
      { name: "Sat", bets: 65, wins: 50 },
      { name: "Sun", bets: 75, wins: 60 },
    ],
  };

  // Recent activity data
  const recentActivity = [
    {
      icon: <SportsSoccer />,
      primary: "Bet placed on Soccer Match",
      secondary: "2 hours ago",
      link: "/soccer-bet",
    },
    {
      icon: <MonetizationOn />,
      primary: "Deposit of $500",
      secondary: "5 hours ago",
      link: "/deposit",
    },
    {
      icon: <TrendingUp />,
      primary: "Won $200 on Tennis",
      secondary: "1 day ago",
      link: "/tennis-win",
    },
    {
      icon: <Notifications />,
      primary: "New promotion available",
      secondary: "2 days ago",
      link: "/promotions",
    },
  ];

  // Handle menu open/close
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle week selection
  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#111827", paddingTop: "64px" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#14b8a6" }}>
        <Toolbar>
          {/* Image and Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/images/BundlesBetsLogo.png" // Replace with your image path
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "12px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "left", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }} // Responsive font size
            >
              BundlesBets AI Dashboard
            </Typography>
          </Box>

          {/* Hamburger Menu (only on small screens) */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ display: { xs: "block", sm: "none" }, ml: "auto" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Navigation Links (only on larger screens) */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            <Link href="/sports" color="inherit" underline="none">
              <Button color="inherit" startIcon={<Sports sx={{ color: "#ffffff" }} />}>
                Sports
              </Button>
            </Link>
            <Link href="/payments" color="inherit" underline="none">
              <Button color="inherit" startIcon={<Payment sx={{ color: "#ffffff" }} />}>
                Payments
              </Button>
            </Link>
            <Link href="/leaderboard" color="inherit" underline="none">
              <Button color="inherit" startIcon={<EmojiEvents sx={{ color: "#ffffff" }} />}>
                Leaderboard
              </Button>
            </Link>
            {/* Logout Button (only on larger screens) */}
            <Button
              color="inherit"
              startIcon={<ExitToApp sx={{ color: "#ffffff" }} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Dropdown (only on small screens) */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <MenuItem onClick={handleClose}>
          <Sports sx={{ mr: 2, color: "#13dfae" }} />
          Sports
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Payment sx={{ mr: 2, color: "#13dfae" }} />
          Payments
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <EmojiEvents sx={{ mr: 2, color: "#13dfae" }} />
          Leaderboard
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 2, color: "#13dfae" }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Dashboard Content */}
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Welcome Message */}
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          color="#ffffff" // White text
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} // Responsive font size
        >
          Welcome Back, {userName || "Guest"}!
        </Typography>

        {/* Quick Stats Section */}
        <Grid container spacing={2} mb={4}>
          {[
            { title: "Total Balance", value: `$${balance.toFixed(2)}`, icon: <AccountBalanceWallet />, link: "/balance" },
            { title: "Total Bets", value: "120", icon: <MonetizationOn />, link: "/bets" },
            { title: "Total Wins", value: "80", icon: <TrendingUp />, link: "/wins" },
            { title: "Notifications", value: "3 New", icon: <Notifications />, link: "/notifications" },
          ].map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href={stat.link} underline="none">
                  <StatsPaper>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: "#14b8a6", mr: 2 }}>
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }} // Responsive font size
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} // Responsive font size
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </StatsPaper>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={8}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsPaper>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold" color="#ffffff">
                    Weekly Betting Activity
                  </Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: "#ffffff" }}>Week</InputLabel>
                    <Select
                      value={selectedWeek}
                      onChange={handleWeekChange}
                      label="Week"
                      size="small"
                      sx={{ color: "#ffffff", "& .MuiSelect-icon": { color: "#ffffff" } }}
                    >
                      <MenuItem value="thisWeek" sx={{ color: "#1f1f1f" }}>This Week</MenuItem>
                      <MenuItem value="feb23_27" sx={{ color: "#1f1f1f" }}>23-27 February</MenuItem>
                      <MenuItem value="feb16_20" sx={{ color: "#1f1f1f" }}>16-20 February</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData[selectedWeek]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bets" fill="#14b8a6" name="Total Bets" />
                    <Bar dataKey="wins" fill="#FFD700" name="Total Wins" />
                  </BarChart>
                </ResponsiveContainer>
              </StatsPaper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsPaper>
                <Typography variant="h6" fontWeight="bold" mb={2} textAlign="left" color="#ffffff">
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <CustomButton startIcon={<AddCircleOutline />} href="/otherPages/displayGames">Place a Bet</CustomButton>
                  <CustomButton startIcon={<History />} href="/otherPages/stripe">Recent Bets</CustomButton>
                  <CustomButton startIcon={<AccountBalance />}>Deposit Funds</CustomButton>
                  <CustomButton startIcon={<LocalAtm />}>Withdraw Funds</CustomButton>
                  <CustomButton startIcon={<Redeem />}>View Promotions</CustomButton>
                </Box>
              </StatsPaper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsPaper>
                <Typography variant="h6" fontWeight="bold" mb={2} color="#ffffff">
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <Link href={activity.link} underline="none">
                        <RecentActivityItem alignItems="flex-start" sx={{ cursor: "pointer" }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#FFD700" }}>{activity.icon}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.primary}
                            secondary={activity.secondary}
                            primaryTypographyProps={{ color: "#ffffff" }} // White text
                            secondaryTypographyProps={{ color: "#cccccc" }} // Light gray text
                          />
                        </RecentActivityItem>
                      </Link>
                      {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </StatsPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;