const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(`User with id:${socket.id} has joined`);
  console.log(`Current connections: ${io.engine.clientsCount}`);
  console.log("----------------")
  socket.on("disconnect", () => {
    console.log("user disconnected");
    console.log(socket.id);
    console.log(`Current connections: ${io.engine.clientsCount}`);
    console.log("----------------")
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
