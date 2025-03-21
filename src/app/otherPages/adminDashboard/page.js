/*"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Dashboard = () => {
  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  const userActivityData = [
    { name: 'Active Users', value: 400 },
    { name: 'Inactive Users', value: 100 },
  ];

  const COLORS = ['#13dfae', '#1a237e']; // Updated colors

  // Sample data for geographical usage
  const locations = [
    { name: 'New York', lat: 40.7128, lng: -74.006, bets: 1200 },
    { name: 'London', lat: 51.5074, lng: -0.1278, bets: 900 },
    { name: 'Tokyo', lat: 35.6895, lng: 139.6917, bets: 1500 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, bets: 700 },
  ];

  // Convert locations to heatmap data format [lat, lng, intensity]
  const heatmapData = locations.map((location) => [location.lat, location.lng, location.bets]);

  // State for winner notification
  const [winnerNotification, setWinnerNotification] = useState(null);

  // Ref for the map instance
  const mapRef = useRef(null);

  // Simulate a winner notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setWinnerNotification({ message: 'User JohnDoe123 has won $500!' });
    }, 5000); // Simulate a notification after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Initialize heatmap after the map is created
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const heatLayer = L.heatLayer(heatmapData, { radius: 25, blur: 15, maxZoom: 17 });
      heatLayer.addTo(map);

      // Debugging: Log the heatmap data and layer
      console.log('Heatmap Data:', heatmapData);
      console.log('Heatmap Layer:', heatLayer);
    }
  }, [heatmapData]);

  const handleCloseNotification = () => {
    setWinnerNotification(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        BundlesBets Betting Platform Dashboard
      </Typography>

      {/* Winner Notification */ /*}
      <Snackbar
        open={!!winnerNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%', backgroundColor: '#13dfae', color: '#1a237e' }}>
          {winnerNotification?.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Key Metrics *//*}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: '#616161' }}>Total Revenue</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#13dfae' }}>$12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: '#616161' }}>Active Users</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#13dfae' }}>1,234</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: '#616161' }}>Total Bets</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#13dfae' }}>5,678</Typography>
          </Paper>
        </Grid>

        {/* Revenue Chart *//*}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Monthly Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#13dfae" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* User Activity Chart *//*}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              User Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#13dfae"
                  label
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Geographical Usage Heatmap *//*}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Platform Usage by Location (Heatmap)
            </Typography>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '400px', width: '100%', borderRadius: 8 }}
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </MapContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;*/