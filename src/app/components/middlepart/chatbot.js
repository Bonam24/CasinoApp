import { useState, useRef } from "react";
import { Fab, Paper, TextField, IconButton, Typography, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Hello! How can I help?", sender: "bot" }]);
    }, 1000);
  };

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 50, right: 20, display: "flex", alignItems: "center", gap: 1, zIndex: 1000 }}>
        {!open && showMessage && (
          <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#13dfae", p: 1, borderRadius: 1, position: "relative" }}>
            <Typography variant="body2" sx={{ color: "black", mr: 1 }}>Ask me a question</Typography>
            <IconButton size="small" onClick={() => setShowMessage(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Fab sx={{ bgcolor: "#13dfae", '&:hover': { bgcolor: "#11c59b" } }} onClick={() => setOpen(!open)}>
          <ChatIcon />
        </Fab>
      </Box>

      {open && (
        <Paper 
          elevation={4} 
          sx={{ 
            position: "fixed", 
            bottom: 110, 
            right: 20, 
            width: 300, 
            height: 400, 
            display: "flex", 
            flexDirection: "column", 
            p: 2,
            borderRadius: 2,
            zIndex: 1100,
            bgcolor: "#fff"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Chatbot</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ flex: 1, overflowY: "auto", marginTop: 8 }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  textAlign: msg.sender === "user" ? "right" : "left", 
                  marginBottom: 8
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    display: "inline-block", 
                    bgcolor: msg.sender === "user" ? "#11c59b" : "grey.300"
                  }}
                >
                  {msg.text}
                </Typography>
              </div>
            ))}
          </div>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TextField 
              fullWidth 
              variant="outlined" 
              size="small" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />
            <IconButton sx={{ bgcolor: "#11c59b", color: "white", '&:hover': { bgcolor: "#0fa88c" } }} onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
