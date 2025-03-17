// components/PasswordResetModal.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../../firebaseConfig"; // Import Firebase auth instance

const PasswordResetModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Reset Password
        </Typography>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Send Reset Email"}
          </Button>
        </Box>
        {message && (
          <Typography
            color={message.includes("sent") ? "green" : "red"}
            mt={2}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default PasswordResetModal;