const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

// Serve static files
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
});

// Display chat message
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });


// Emitting events
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


// Username


server.listen(3000, () => {
  console.log('listening on *:3000');
});