const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // Use recommended import for socket.io
const corsOptions = require('./src/config/corsConfig');
const systemRoutes = require('./src/routes/systemRoutes');
const { getSystemMetrics } = require('./src/services/systemService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors(corsOptions));
app.use('/api/system', systemRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Emit metrics function
  const emitMetrics = async () => {
    try {
      const metrics = await getSystemMetrics();
      socket.emit('systemMetrics', metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Initial Emit
  emitMetrics();

  // Real-Time Updates every 5 seconds
  const interval = setInterval(emitMetrics, 5000);

  // Handle Manual Refresh from Client
  socket.on('getMetrics', () => {
    console.log('Manual refresh requested by:', socket.id);
    emitMetrics();
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
