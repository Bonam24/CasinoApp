"use client";
import React, { useState } from "react";
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
} from "@mui/icons-material";
import { motion } from "framer-motion";

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
  //backgroundColor: "#13dfae",
  backgroundColor: "#10c79d",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#10c79d",
  },
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "16px",
  textTransform: "none",
});

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For the menu dropdown
  const [selectedWeek, setSelectedWeek] = useState("thisWeek"); // For week selection
  const open = Boolean(anchorEl);

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
    },
    {
      icon: <MonetizationOn />,
      primary: "Deposit of $500",
      secondary: "5 hours ago",
    },
    {
      icon: <TrendingUp />,
      primary: "Won $200 on Tennis",
      secondary: "1 day ago",
    },
    {
      icon: <Notifications />,
      primary: "New promotion available",
      secondary: "2 days ago",
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
      <AppBar position="fixed" sx={{ backgroundColor: "#10c79d" }}>
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

          {/* Title (moved to the left) */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
            BundlesBets AI Dashboard
          </Typography>

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
          <Link href="/logout" color="inherit" underline="none">
            <Button color="inherit" startIcon={<ExitToApp sx={{ color: "#FFD700" }} />}>
              Logout
            </Button>
          </Link>
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
          Welcome Back, Bonam JR!
        </Typography>

        {/* Quick Stats Section */}
        <Grid container spacing={4} mb={4}>
          {[
            { title: "Total Balance", value: "$2,500", icon: <AccountBalanceWallet /> },
            { title: "Total Bets", value: "120", icon: <MonetizationOn /> },
            { title: "Total Wins", value: "80", icon: <TrendingUp /> },
            { title: "Notifications", value: "3 New", icon: <Notifications /> },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <DashboardPaper>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#13dfae", mr: 2 }}>
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
                    <Bar dataKey="bets" fill="#13dfae" name="Total Bets" />
                    <Bar dataKey="wins" fill="#10c79d" name="Total Wins" />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardPaper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <DashboardPaper>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <CustomButton fullWidth>Place a Bet</CustomButton>
                  <CustomButton fullWidth>Recent Bets</CustomButton>
                  <CustomButton fullWidth>Deposit Funds</CustomButton>
                  <CustomButton fullWidth>Withdraw Funds</CustomButton>
                  <CustomButton fullWidth>View Promotions</CustomButton>
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
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#13dfae" }}>{activity.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.primary}
                          secondary={activity.secondary}
                        />
                      </ListItem>
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