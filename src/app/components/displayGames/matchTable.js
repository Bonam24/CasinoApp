import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, Button } from "@mui/material";

export default function MatchTable({ matches, currentPage, matchesPerPage, handlePlaceBet, isSmallScreen }) {
  const generateRandomOdds = () => {
    return (Math.random() * 5 + 1).toFixed(2); // Random odds between 1.00 and 6.00
  };

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  return (
    <TableContainer component={Paper} className="bg-[#1E3A8A] max-h-[600px] overflow-y-auto">
      <Table stickyHeader>
        <TableHead>
          <TableRow className="bg-[#1E3A8A]">
            <TableCell className="text-white">Fixture</TableCell>
            <TableCell className="text-white">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentMatches.map((match) => (
            <TableRow key={match.fixture.id} className="hover:bg-[#1E3A8A]/90 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <Typography variant="body2" className="text-gray-200 mb-2">
                    {new Date(match.fixture.date).toLocaleDateString()} -{" "}
                    {new Date(match.fixture.date).toLocaleTimeString()}
                  </Typography>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        sx={{ width: isSmallScreen ? 16 : 24, height: isSmallScreen ? 16 : 24 }}
                      />
                      <Typography className="text-white" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                        {match.teams.home.name}
                      </Typography>
                    </div>
                    <Typography className="text-white">vs</Typography>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        sx={{ width: isSmallScreen ? 16 : 24, height: isSmallScreen ? 16 : 24 }}
                      />
                      <Typography className="text-white" sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
                        {match.teams.away.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePlaceBet(match, "home")}
                    className="flex-1"
                    size={isSmallScreen ? "small" : "medium"}
                    startIcon={
                      <Avatar
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        sx={{ width: isSmallScreen ? 12 : 16, height: isSmallScreen ? 12 : 16 }}
                      />
                    }
                  >
                    Win ({generateRandomOdds()})
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handlePlaceBet(match, "draw")}
                    className="flex-1"
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Draw ({generateRandomOdds()})
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handlePlaceBet(match, "away")}
                    className="flex-1"
                    size={isSmallScreen ? "small" : "medium"}
                    startIcon={
                      <Avatar
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        sx={{ width: isSmallScreen ? 12 : 16, height: isSmallScreen ? 12 : 16 }}
                      />
                    }
                  >
                    Win ({generateRandomOdds()})
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => alert("More Bets clicked!")}
                    className="flex-1"
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    More Bets
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => alert("Predicted Score clicked!")}
                    className="flex-1"
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Predicted Score
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}