const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000; // Match your frontend port

// Serve all static files from root directory
app.use(express.static(path.join(__dirname)));

// Serve main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
http.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
