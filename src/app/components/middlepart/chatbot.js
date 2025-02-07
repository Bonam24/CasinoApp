import { useState } from "react";
import { Fab, Paper, TextField, IconButton, Typography, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

const handleSendMessage = async () => {
  if (!input.trim() || loading) return;
  
  setLoading(true);  // Disable input while waiting for response

  const userMessage = { text: input, sender: "user" };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();
    const botMessage = { 
      text: data.response || "Sorry, I didn't understand that.", 
      sender: "bot" 
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    setMessages((prev) => [...prev, { text: "Error communicating with chatbot.", sender: "bot" }]);
  } finally {
    setLoading(false);  // Re-enable input
  }
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
