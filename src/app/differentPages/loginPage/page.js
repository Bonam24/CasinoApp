"use client";
import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import SuccessModal from "./loginComponents/successModal"; // Import the SuccessModal component



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
    country: "USA",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [countries, setCountries] = useState([]); // State to store the list of countries
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const router = useRouter(); // Initialize the router

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDOB = minDate.toISOString().split("T")[0];

  // Fetch the list of countries from the API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        // Map and sort countries alphabetically by name
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debugging
    setFormData({ ...formData, [name]: value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    if (!formData.email || !formData.password) {
      setMessage("Please provide both email and password.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/loginAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }
  
      setMessage("Login successful! Redirecting...");
      router.push("/differentPages/dashboard"); // Redirect to the dashboard
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
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
  
    try {
      const response = await fetch("/api/signupAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          country: formData.country,
          dob: formData.dob,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }
  
      setIsModalOpen(true); // Open the success modal
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        country: "USA",
        dob: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  // Check if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Function to handle redirection to the login tab
  const handleRedirectToLogin = () => {
    setIsModalOpen(false); // Close the modal
    setTab(0); // Switch to the Sign In tab
  };

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
                value={formData.email} // Bind to formData.email
                onChange={handleChange} // Update formData on change
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password} // Bind to formData.password
                onChange={handleChange} // Update formData on change
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
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </TextField>
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

      {/* Success Modal */}
      <SuccessModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        onRedirect={handleRedirectToLogin} // Pass the redirection callback
      />
    </Box>
  );
};

export default Login;