import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500, // Increased width for better readability
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center",
};

const SuccessModal = ({ open, onClose, onRedirect }) => {
  // Function to handle the Close button click
  const handleClose = () => {
    onClose(); // Close the modal
    onRedirect(); // Trigger the redirection callback
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: "#333" }}>
            🎉 Registration Successful!
          </Typography>
          <Typography variant="body1" mb={4} sx={{ color: "#555", fontSize: "1.1rem" }}>
            Please check your email and click on the verification link to complete
            your registration.
          </Typography>
          <Button
            variant="contained"
            onClick={handleClose} // Trigger the callback
            sx={{
              backgroundColor: "#13dfae",
              color: "#fff",
              "&:hover": { backgroundColor: "#10c79d" },
              fontSize: "1rem",
              padding: "10px 20px",
            }}
          >
            Return to Sign In
          </Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default SuccessModal;