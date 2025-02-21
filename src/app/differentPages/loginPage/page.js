"use client";
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Link, Tabs, Tab, MenuItem, Grid, IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

const CustomButton = styled(Button)({
  backgroundColor: "#13dfae",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#10c79d",
  },
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "16px",
  textTransform: "none",
});

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#13dfae",
  },
});

const StyledTab = styled(Tab)({
  "&.Mui-selected": {
    color: "#13dfae",
    fontWeight: "bold",
  },
});

const BackgroundAnimation = styled(motion.div)({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "linear-gradient(120deg, #13dfae, #10c79d, #f5f5f5)",
  opacity: 0.2,
  zIndex: -1,
});

const Login = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDOB = minDate.toISOString().split("T")[0];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      position="relative"
      overflow="hidden"
      sx={{ padding: { xs: 2, sm: 0 }, overflowY: "auto" }}
    >
      <BackgroundAnimation
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 500,
          zIndex: 1,
          marginTop: { xs: tab === 1 ? "8em" : "1em", sm: "1em" },
        }}
      >
        <StyledTabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <StyledTab label="Login" />
          <StyledTab label="Sign Up" />
        </StyledTabs>
        <Box sx={{ display: tab === 0 ? "block" : "block" }}>
          {tab === 0 && (
            <>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                Login
              </Typography>
              <TextField fullWidth label="Email" margin="normal" variant="outlined" />
              <TextField fullWidth label="Password" type="password" margin="normal" variant="outlined" />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Link href="#" variant="body2">Forgot Password?</Link>
                <Typography variant="body2">
                  Don't have an account? <Link href="#" onClick={() => setTab(1)}>Sign Up</Link>
                </Typography>
              </Box>
              <Box mt={2}>
                <CustomButton fullWidth>Sign In</CustomButton>
              </Box>
            </>
          )}
          {tab === 1 && (
            <Box mt={3}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                Sign Up
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" margin="normal" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Username" margin="normal" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" margin="normal" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" margin="normal" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Country"
                    margin="normal"
                    variant="outlined"
                    defaultValue="USA"
                  >
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                    <MenuItem value="Mexico">Mexico</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Date of Birth" type="date" margin="normal" variant="outlined" inputProps={{ max: minDOB }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    helperText={password && confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <CustomButton fullWidth>Register</CustomButton>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
