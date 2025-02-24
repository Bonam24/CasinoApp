'use client'; // Mark this component as a Client Component

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Link,
  Tabs,
  Tab,
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons for show/hide password
import { login, signup } from "./action"; // Import server actions

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "USA",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDOB = minDate.toISOString().split("T")[0];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);
    const { error } = await login(formData);

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage("Login successful! Redirecting...");
      // Redirect is handled in the server action
    }
  };

  // Handle signup submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate all fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.dob ||
      !formData.password
    ) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("email", formData.email);
    formDataObj.append("password", formData.password);

    const { error } = await signup(formDataObj);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Registration successful! ✅");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "USA",
        dob: "",
        password: "",
        confirmPassword: "",
      });
    }

    setLoading(false);
  };

  // Get country code and flag based on selected country
  const getCountryCodeAndFlag = () => {
    switch (formData.country) {
      case "USA":
        return { code: "+1", flag: "🇺🇸" };
      case "Canada":
        return { code: "+1", flag: "🇨🇦" };
      case "Mexico":
        return { code: "+52", flag: "🇲🇽" };
      default:
        return { code: "", flag: "" };
    }
  };

  const { code, flag } = getCountryCodeAndFlag();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  // Check if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword;

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
          marginTop: { xs: tab === 1 ? "18em" : "2em", sm: "4em", md: "6em" },
        }}
      >
        <StyledTabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <StyledTab label="Login" />
          <StyledTab label="Sign Up" />
        </StyledTabs>
        <Box sx={{ display: tab === 0 ? "block" : "block" }}>
          {tab === 0 && (
            <form onSubmit={handleLogin}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                Login
              </Typography>
              <TextField
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Link href="#" variant="body2">Forgot Password?</Link>
                <Typography variant="body2">
                  Don't have an account? <Link href="#" onClick={() => setTab(1)}>Sign Up</Link>
                </Typography>
              </Box>
              <Box mt={2}>
                <CustomButton type="submit" fullWidth disabled={loading}>
                  {loading ? "Logging in..." : "Sign In"}
                </CustomButton>
              </Box>
              {message && <Typography color={message.includes("success") ? "green" : "red"}>{message}</Typography>}
            </form>
          )}
          {tab === 1 && (
            <Box mt={3} component="form" onSubmit={handleRegister}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                Sign Up
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} margin="normal" variant="outlined" required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} margin="normal" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" variant="outlined" required />
                </Grid>
                {/* Country Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="USA"> USA</MenuItem>
                    <MenuItem value="Canada"> Canada</MenuItem>
                    <MenuItem value="Mexico"> Mexico</MenuItem>
                  </TextField>
                </Grid>
                {/* Phone Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    placeholder="123-456-7890"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {code}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Date of Birth Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    inputProps={{ max: minDOB }}
                    required
                    helperText="Please enter your date of birth"
                  />
                </Grid>
                {/* Password Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Confirm Password Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowConfirmPassword}>
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <Grid item xs={12}>
                    <Typography color={passwordsMatch ? "green" : "red"}>
                      {passwordsMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Box mt={2}>
                <CustomButton fullWidth type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </CustomButton>
              </Box>
              {message && <Typography color={message.includes("success") ? "green" : "red"}>{message}</Typography>}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;