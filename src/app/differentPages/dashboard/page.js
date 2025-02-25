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
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import { logout } from "../loginPage/action"; // Import the logout function

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Custom styled components
const DashboardPaper = styled(Paper)({
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
  },
});

const CustomButton = styled(Button)({
  backgroundColor: "#0ead87", // Primary teal-green
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
    backgroundColor: "#f5f5f5", // Light gray on hover
  },
});

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For the menu dropdown
  const [selectedWeek, setSelectedWeek] = useState("thisWeek"); // For week selection
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [balance, setBalance] = useState(0); // State to store the user's balance
  const open = Boolean(anchorEl);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current authenticated user
        const { data: user, error: authError } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        // Fetch user data from the `profiles` table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, balance") // Include the balance field
          .eq("id", user.user.id) // Match the user's ID
          .single(); // Return a single record

        if (profileError) {
          throw profileError;
        }

        // Set the user's name and balance
        setUserName(profile.first_name || "Guest");
        setBalance(profile.balance || 0); // Set the balance (default to 0 if not available)
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserName("Guest"); // Fallback to "Guest" if the request fails
        setBalance(0); // Fallback to 0 if the request fails
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout(); // Call the logout function
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
    <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5", paddingTop: "64px" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#0ead87" }}>
        <Toolbar>
          {/* Hamburger Menu (only on small screens) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Image and Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/images/BundlesBetsLogo.png" // Replace with your image path
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "12px" }}
            />
            <Typography variant="h6" component="div" sx={{ textAlign: "left" }} fontWeight={600}>
              BundlesBets AI Dashboard
            </Typography>
          </Box>

          {/* Navigation Links (only on larger screens) */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            <Link href="/sports" color="inherit" underline="none">
              <Button color="inherit" startIcon={<Sports sx={{ color: "#FFD700" }} />}>
                Sports
              </Button>
            </Link>
            <Link href="/payments" color="inherit" underline="none">
              <Button color="inherit" startIcon={<Payment sx={{ color: "#FFD700" }} />}>
                Payments
              </Button>
            </Link>
            <Link href="/leaderboard" color="inherit" underline="none">
              <Button color="inherit" startIcon={<EmojiEvents sx={{ color: "#FFD700" }} />}>
                Leaderboard
              </Button>
            </Link>
          </Box>

          {/* Logout Link with Text */}
          <Button
            color="inherit"
            startIcon={<ExitToApp sx={{ color: "#FFD700" }} />}
            onClick={handleLogout} // Call handleLogout on click
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menu Dropdown (only on small screens) */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={open}
        onClose={handleClose}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <MenuItem onClick={handleClose}>
          <Sports sx={{ mr: 2, color: "#FFD700" }} />
          Sports
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Payment sx={{ mr: 2, color: "#FFD700" }} />
          Payments
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <EmojiEvents sx={{ mr: 2, color: "#FFD700" }} />
          Leaderboard
        </MenuItem>
      </Menu>

      {/* Dashboard Content */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="#222">
          Welcome Back, {userName || "Guest"}!
        </Typography>

        {/* Quick Stats Section */}
        <Grid container spacing={4} mb={4}>
          {[
            { title: "Total Balance", value: `$${balance.toFixed(2)}`, icon: <AccountBalanceWallet />, link: "/balance" },
            { title: "Total Bets", value: "120", icon: <MonetizationOn />, link: "/bets" },
            { title: "Total Wins", value: "80", icon: <TrendingUp />, link: "/wins" },
            { title: "Notifications", value: "3 New", icon: <Notifications />, link: "/notifications" },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href={stat.link} underline="none">
                  <DashboardPaper>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: "#0c8a6a", mr: 2 }}>
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{stat.title}</Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </DashboardPaper>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={8}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <DashboardPaper>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Weekly Betting Activity
                  </Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Week</InputLabel>
                    <Select
                      value={selectedWeek}
                      onChange={handleWeekChange}
                      label="Week"
                      size="small"
                    >
                      <MenuItem value="thisWeek">This Week</MenuItem>
                      <MenuItem value="feb23_27">23-27 February</MenuItem>
                      <MenuItem value="feb16_20">16-20 February</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData[selectedWeek]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bets" fill="#0ead87" name="Total Bets" />
                    <Bar dataKey="wins" fill="#FFD700" name="Total Wins" />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardPaper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <DashboardPaper>
                <Typography variant="h6" fontWeight="bold" mb={2} textAlign="left">
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <CustomButton startIcon={<AddCircleOutline />}>Place a Bet</CustomButton>
                  <CustomButton startIcon={<History />}>Recent Bets</CustomButton>
                  <CustomButton startIcon={<AccountBalance />}>Deposit Funds</CustomButton>
                  <CustomButton startIcon={<LocalAtm />}>Withdraw Funds</CustomButton>
                  <CustomButton startIcon={<Redeem />}>View Promotions</CustomButton>
                </Box>
              </DashboardPaper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <DashboardPaper>
                <Typography variant="h6" fontWeight="bold" mb={2}>
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
                            primaryTypographyProps={{ color: "#333" }}
                            secondaryTypographyProps={{ color: "#666" }}
                          />
                        </RecentActivityItem>
                      </Link>
                      {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </DashboardPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;