"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { Close as CloseIcon } from "@mui/icons-material";
import matchesData from "./matchesData.json";
import QRCode from "qrcode"; // Import qrcode library
 // For generating QR codes
import { jsPDF } from "jspdf"; // For generating PDFs

// Define primary and secondary colors
const primaryColor = "#13dfae";
const primaryDarkColor = "#0fa37e"; // Darker shade for hover
const secondaryColor = "#FFD700"; // Golden color for action buttons
const secondaryDarkColor = "#e6b800"; // Darker shade for hover

// Custom styled components
const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  borderCollapse: "separate",
  borderSpacing: "0 10px", // Add spacing between rows
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%", // Make table responsive on small screens
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: "#000", // Black text for contrast
  textAlign: "center",
  border: "none", // Remove default borders
  fontSize: "0.875rem", // Smaller font size
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem", // Smaller font size on small screens
    padding: "8px", // Reduce padding on small screens
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#FFFFFF", // White background for rows
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#F8F9FA", // Light gray on hover
  },
}));

const BetButton = styled(Button)({
  backgroundColor: primaryColor, // Use primary color
  color: "#000", // Black text for contrast
  "&:hover": {
    backgroundColor: primaryDarkColor, // Darker primary color on hover
  },
  borderRadius: "8px",
  padding: "6px 12px", // Smaller padding
  fontSize: "12px", // Smaller font size
  textTransform: "none",
  fontWeight: "bold",
});

const ActionButton = styled(Button)({
  backgroundColor: secondaryColor, // Use secondary color
  color: "#222", // Dark text for contrast
  "&:hover": {
    backgroundColor: secondaryDarkColor, // Darker secondary color on hover
  },
  borderRadius: "8px",
  padding: "6px 12px", // Smaller padding
  fontSize: "12px", // Smaller font size
  textTransform: "none",
  fontWeight: "bold",
  margin: "4px", // Add spacing between buttons
});

// Helper function to format date in a consistent way
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd"); // Use date-fns for consistent formatting
};

const MatchesTable = () => {
  const [selectedLeague, setSelectedLeague] = useState("all"); // State for league selection
  const [selectedMatches, setSelectedMatches] = useState({}); // State for selected matches
  const [betAmount, setBetAmount] = useState(""); // State for bet amount

  // Handle league selection change
  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
  };

  // Handle team or draw selection
  const handleSelection = (matchId, option, odds, match) => {
    setSelectedMatches((prev) => ({
      ...prev,
      [matchId]: { option, odds, match },
    }));
  };

  // Handle removing a selected match
  const handleRemoveMatch = (matchId) => {
    setSelectedMatches((prev) => {
      const updatedMatches = { ...prev };
      delete updatedMatches[matchId];
      return updatedMatches;
    });
  };

  // Calculate expected returns
  const calculateExpectedReturns = () => {
    const totalOdds = Object.values(selectedMatches).reduce(
      (sum, { odds }) => sum + parseFloat(odds),
      0
    );
    return (parseFloat(betAmount) * totalOdds).toFixed(2);
  };

  // Generate and download PDF ticket

  const generateTicket = async () => {
    const doc = new jsPDF();
  
    // Constants for styling
    const primaryColor = [19, 223, 174]; // #13dfae in RGB
    const secondaryColor = [0, 0, 0]; // Black
    const watermarkOpacity = 0.05; // 5% opacity for watermark (very faint)
    const padding = 10; // Padding for content
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    const pageHeight = doc.internal.pageSize.getHeight(); // Get page height
  
    // Add a border around the ticket
    doc.setDrawColor(...primaryColor); // Set border color to #13dfae
    doc.setLineWidth(0.5); // Thin border
    doc.rect(padding, padding, pageWidth - 2 * padding, pageHeight - 2 * padding); // Draw border
  
    // Add a faint watermark
    doc.setFontSize(40);
    doc.setTextColor(...primaryColor, watermarkOpacity * 255); // Set watermark color with opacity
    doc.setFont("helvetica", "bold");
    doc.text("BundleBets", pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: "center",
      baseline: "middle",
    });
  
    // Reset text color and font for content
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
  
    // Add header with logo and title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Betting Ticket", pageWidth / 2, padding + 15, { align: "center" });
  
    // Add a divider line under the header
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(padding, padding + 20, pageWidth - padding, padding + 20);
  
    // Add date and time
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, padding, padding + 30);
  
    // Add a divider line below the date
    doc.text("---------------", padding, padding + 35);
  
    // Add bet amount
    doc.text(`Bet Amount: $${betAmount}`, padding, padding + 45);
  
    // Add a divider line below the bet amount
    doc.text("---------------", padding, padding + 50);
  
    // Add potential winnings
    doc.text(`Potential Winnings: $${calculateExpectedReturns()}`, padding, padding + 60);
  
    // Add a divider line below the potential winnings
    doc.text("---------------", padding, padding + 65);
  
    // Add a section header for selected matches
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Selected Matches", padding, padding + 75);
  
    // Add a divider line below the selected matches header
    doc.text("---------------", padding, padding + 80);
  
    // Add selected matches
    let yPos = padding + 85;
    Object.entries(selectedMatches).forEach(([matchId, { option, odds, match }]) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `• ${match.team1.name} vs ${match.team2.name} - ${option} (Odds: ${odds})`,
        padding,
        yPos
      );
      yPos += 10;
    });
  
    // Add a QR code for verification
    const qrCodeData = JSON.stringify({
      date: format(new Date(), "yyyy-MM-dd HH:mm"),
      betAmount,
      potentialWinnings: calculateExpectedReturns(),
      selectedMatches: Object.values(selectedMatches).map(({ match, option, odds }) => ({
        match: `${match.team1.name} vs ${match.team2.name}`,
        option,
        odds,
      })),
    });
  
    // Generate QR code on a canvas
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, qrCodeData, { width: 100 });
  
    // Convert canvas to image and add to PDF
    const qrCodeImage = canvas.toDataURL("image/png");
    const qrCodeWidth = 50;
    const qrCodeHeight = 50;
    doc.addImage(
      qrCodeImage,
      "PNG",
      pageWidth - padding - qrCodeWidth,
      pageHeight - padding - qrCodeHeight,
      qrCodeWidth,
      qrCodeHeight
    );
  
    // Add footer text
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for using BundleBets!",
      pageWidth / 2,
      pageHeight - padding - qrCodeHeight - 10,
      { align: "center" }
    );
  
    // Save the PDF
    doc.save("betting_ticket.pdf");
  };
// Handle placing a bet
const handlePlaceBet = async () => {
  console.log("Placing bet:", {
    selectedMatches,
    betAmount,
    expectedReturns: calculateExpectedReturns(),
  });

  // Generate and download the ticket
  await generateTicket();

  // Reset selected matches and bet amount
  setSelectedMatches({});
  setBetAmount("");
};

  // Handle canceling the bet
  const handleCancel = () => {
    setSelectedMatches({});
    setBetAmount("");
  };

  // Filter matches based on selected league
  const filteredMatches =
    selectedLeague === "all"
      ? matchesData
      : matchesData.filter((match) => match.league === selectedLeague);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#F5F5F5", // Light gray background
        minHeight: "100vh",
        color: "#000", // Black text for contrast
        display: "flex",
        gap: 4,
      }}
    >
      {/* Fixed League Selection */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: primaryDarkColor, // Darker primary color for header
          zIndex: 1000,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#FFFFFF", fontSize: "0.875rem" }}>League</InputLabel>
          <Select
            value={selectedLeague}
            onChange={handleLeagueChange}
            label="League"
            sx={{ color: "#FFFFFF", fontSize: "0.875rem", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" } }}
          >
            <MenuItem value="all" sx={{ fontSize: "0.875rem" }}>All</MenuItem>
            <MenuItem value="nba" sx={{ fontSize: "0.875rem" }}>NBA</MenuItem>
            <MenuItem value="epl" sx={{ fontSize: "0.875rem" }}>EPL</MenuItem>
            <MenuItem value="la-liga" sx={{ fontSize: "0.875rem" }}>La Liga</MenuItem>
            <MenuItem value="uefa" sx={{ fontSize: "0.875rem" }}>UEFA</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <Box sx={{ height: "100px" }} />

      {/* Matches Table */}
      <Box sx={{ flex: 1, overflowX: "auto", mr: { sm: "400px" } }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="#000" sx={{ fontSize: "1.25rem" }}>
          Upcoming Matches
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "none",
            background: "transparent",
          }}
        >
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ textAlign: "left", pl: 4 }}>Match ID</StyledTableCell>
                <StyledTableCell sx={{ textAlign: "left" }}>Teams</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>1</StyledTableCell>
                <StyledTableCell>X</StyledTableCell>
                <StyledTableCell>2</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMatches.map((match) => (
                <StyledTableRow
                  key={match.id}
                  sx={{
                    backgroundColor: selectedMatches[match.id] ? "#E8F5E9" : "#FFFFFF", // Green background for selected matches
                  }}
                >
                  {/* Match ID */}
                  <StyledTableCell sx={{ textAlign: "left", pl: 4 }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ fontSize: "0.875rem" }}>
                      {match.id}
                    </Typography>
                  </StyledTableCell>

                  {/* Teams */}
                  <StyledTableCell sx={{ textAlign: "left" }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={match.team1.logo}
                        alt={match.team1.name}
                        sx={{ width: 30, height: 30, bgcolor: primaryColor }} // Use primary color for team icon
                      />
                      <Typography variant="body1" fontWeight="bold" sx={{ fontSize: "0.875rem" }}>
                        {match.team1.name} vs {match.team2.name}
                      </Typography>
                      <Avatar
                        src={match.team2.logo}
                        alt={match.team2.name}
                        sx={{ width: 30, height: 30, bgcolor: primaryColor }} // Use primary color for team icon
                      />
                    </Box>
                  </StyledTableCell>

                  {/* Date */}
                  <StyledTableCell>
                    <Typography variant="body1" fontWeight="bold" sx={{ fontSize: "0.875rem" }}>
                      {formatDate(match.date)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                      {format(new Date(match.date), "HH:mm")} {/* Use date-fns for consistent time formatting */}
                    </Typography>
                  </StyledTableCell>

                  {/* Odds Buttons */}
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: primaryColor, color: "#000", width: "100%", fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={() => handleSelection(match.id, match.team1.name, match.odds.team1, match)}
                    >
                      {match.team1.name} ({match.odds.team1})
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: primaryColor, color: "#000", width: "100%", fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={() => handleSelection(match.id, "Draw", match.odds.draw, match)}
                    >
                      Draw ({match.odds.draw})
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: primaryColor, color: "#000", width: "100%", fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={() => handleSelection(match.id, match.team2.name, match.odds.team2, match)}
                    >
                      {match.team2.name} ({match.odds.team2})
                    </Button>
                  </StyledTableCell>

                  {/* Additional Actions */}
                  <StyledTableCell>
                    <Box display="flex" gap={1}>
                      <ActionButton>View Details</ActionButton>
                      <ActionButton>More Options</ActionButton>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Box>

      {/* Fixed Bet Component on the Far Right */}
      <Box
        sx={{
          position: "fixed",
          top: "100px", // Align with the first row of the matches table
          right: 16,
          width: { xs: "90%", sm: "350px" },
          bgcolor: "background.paper",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
          borderRadius: "12px",
          zIndex: 1000,
          height: "80vh", // 80% of the screen height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Selected Matches
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto", // Scrollable list of selected matches
            mb: 2,
          }}
        >
          {Object.entries(selectedMatches).map(([matchId, { option, odds, match }]) => (
            <Box key={matchId}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  Match {matchId}: {match.team1.name} vs {match.team2.name} - {option} (Odds: {odds})
                </Typography>
                <IconButton onClick={() => handleRemoveMatch(matchId)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} /> {/* Border line after each match */}
            </Box>
          ))}
        </Box>

        {/* Fixed Input and Bet Button Section */}
        <Box sx={{ flexShrink: 0 }}>
          <TextField
            label="Total Bet Amount"
            type="number"
            fullWidth
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          {betAmount && (
            <Typography variant="body1" fontWeight="bold" mb={2}>
              Expected Returns: ${calculateExpectedReturns()}
            </Typography>
          )}
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleCancel}
              sx={{ color: primaryColor, borderColor: primaryColor }}
            >
              Cancel
            </Button>
            <BetButton onClick={handlePlaceBet} fullWidth>
              Place Bet
            </BetButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MatchesTable;