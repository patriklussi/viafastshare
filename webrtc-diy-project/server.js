const express = require("express");
const { copyFileSync } = require("fs");
const app = express();
const server = require("http").createServer(app);
const socket = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

roomList = [];

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing.ejs");
});

/*
app.get("/:room", (req, res) => {
  res.render("room.ejs", { roomId: req.params.room });
});
*/
app.get("/new-room", (req, res) => {
  res.render("room.ejs");
});

socket.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendArrayInfo", () => {
    socket.emit("sendRoomArray", roomList);
  });

  socket.on("room-name", (room) => {
    roomList.push(room);
    socket.emit("addRoom", room, roomList);
  });

  socket.on("join-room", (userId, room) => {
    console.log("Room", room);
    console.log("UserID", userId);
    socket.join(room);
    socket.to(room).emit("user-connected", userId);
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
