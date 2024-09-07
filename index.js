const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const users = {}; // Object to keep track of usernames by socket ID

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  console.log(`Current connections: ${io.engine.clientsCount}`);
  console.log("----------------");

  // Handle setting the username
  socket.on("set username", (username) => {
    users[socket.id] = username; // Store the username with the socket ID
    console.log(`User with id ${socket.id} set username to ${username}`);
    io.emit("chat message", `${username} has joined the chat`);
  });

  // Handle chat messages
  socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous"; // Fallback if no username is set
    io.emit("chat message", `${username}: ${msg}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const username = users[socket.id] || `User with id ${socket.id}`;
    console.log(`User disconnected: ${socket.id}`);
    console.log(`Current connections: ${io.engine.clientsCount}`);
    console.log("----------------");
    io.emit("chat message", `${username} has left the chat`);
    delete users[socket.id]; // Remove the user from the users object
  });
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});