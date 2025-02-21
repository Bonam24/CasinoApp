import { useState } from "react";
import { Card, CardContent, Grid, Box, Button } from "@mui/material";
import { CheckCircle } from "lucide-react";

const Bitpay = "/images/paymentlogos/BitPay.jpg";
const Binance = "/images/paymentlogos/binance.jpg";
const Coinbase = "/images/paymentlogos/coinbase.png";
const Phantom = "/images/paymentlogos/phantom.jpg";

const paymentGateways = [
  { name: "Coinbase", logo: Coinbase },
  { name: "Binance", logo: Binance },
  { name: "Phantom", logo: Phantom },
  { name: "BitPay", logo: Bitpay },
];

export default function PaymentGatewaySelector() {
  const [selectedGateway, setSelectedGateway] = useState(null);

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {paymentGateways.map((gateway) => (
          <Grid item xs={12} sm={6} key={gateway.name}>
            <Card
              sx={{
                cursor: "pointer",
                p: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${
                  selectedGateway === gateway.name ? "#13dfae" : "#ccc"
                }`,
                borderRadius: "12px",
                transition: "all 0.3s",
                '&:hover': { borderColor: "#13dfae" },
              }}
              onClick={() => setSelectedGateway(gateway.name)}
            >
              <Box
                component="img"
                src={gateway.logo}
                alt={gateway.name}
                sx={{ width: 80, height: 80, borderRadius: "50%", mb: 2 }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Box component="p" sx={{ fontWeight: "bold", color: "#333" }}>
                  {gateway.name}
                </Box>
              </CardContent>
              {selectedGateway === gateway.name && (
                <CheckCircle size={24} color="#13dfae" />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedGateway && (
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#13dfae",
            color: "#000",
            '&:hover': { backgroundColor: "#00cc7a" },
          }}
          fullWidth
        >
          Proceed with {selectedGateway}
        </Button>
      )}
    </Box>
  );
}
