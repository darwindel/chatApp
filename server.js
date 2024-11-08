const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');  // Import the CORS middleware

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow React frontend to connect
    methods: ['GET', 'POST'],         // Allow GET and POST methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
  }
});

// Enable Express CORS for HTTP routes
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only React frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Static files (if production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// WebSocket connection handler (Socket.IO)
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chatMessage', (msg) => {
    console.log('Received chat message:', msg);
    io.emit('chatMessage', msg);  // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
