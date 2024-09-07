const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");

// Use the following line to integrate with Web PubSub for Socket.IO
useAzureSocketIO(io, {
  hub: "Hub", // The hub name can be any valid string.
  connectionString: process.argv[2]
});

app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' folder

const users = {}; // Object to keep track of usernames by id
const msg = {
  general: [],
  jokes: [],
  coding: [],
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle setting the username
  socket.on("set username", (username) => {
    users[socket.id] = username;
    console.log(`User with id ${socket.id} set username to ${username}`);
  });

  // Handle chat messages
  socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
    const payload = {
      content,
      chatName,
      sender,
    };

    if (isChannel) {
      socket.to(to).emit("new message", payload); // Send message to room
      if (msg[chatName]) {
        msg[chatName].push(payload); // Save the message in the channel's history
      }
    } else {
      // Handle direct messages here if needed
      socket.to(to).emit("new message", payload);
    }
  });

  // Handle user joining a room
  socket.on("join room", (roomName, cb) => {
    socket.join(roomName);
    cb(msg[roomName] || []); // Send existing messages of the room to the client
    console.log(`${users[socket.id]} joined room: ${roomName}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});