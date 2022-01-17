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
  res.render("createRoom.ejs");
});

/*
app.get("/:room", (req, res) => {
  res.render("room.ejs", { roomId: req.params.room });
});
*/
app.get("/create-room", (req, res) => {
  res.render("createRoom.ejs",res);
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

  socket.on("join-room", (peerObj, room) => {
    console.log("Room", room);
    console.log("UserID", peerObj);
    socket.join(room);
    socket.broadcast.to(room).emit("user-connected", peerObj.id,peerObj);
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
