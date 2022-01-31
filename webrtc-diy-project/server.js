const express = require("express");
const { copyFileSync } = require("fs");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const socket = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

roomList = [];
peerList = [];
nameList = [];

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

socket.on("connection", (socket) => {
  console.log("connected");

  socket.on("sendArrayInfo", () => {
    socket.emit("sendRoomArray", roomList);
  });

  socket.on("room-name", (room) => {
    if (roomList.includes(room)) {
      socket.emit("alert-room", room);
    } else {
      roomList.push(room);
      socket.emit("trigger");
      peerList = [];
    }
  });
  /*
  socket.on("name-send", (name) => {
    nameList.push(name);
    console.log(nameList);
  });
  */

  socket.on("clear", () => {});

  socket.on("join-room", (peerObj, room) => {
  
    nameList.push(peerObj.name)
    console.log("UserID", peerObj);
    if (peerList.includes(peerObj.id)) {
      console.log("nononono")
    } else {
      console.log("joined room",peerObj.id, room);
      socket.join(room);
      peerList.push(peerObj.id);
      socket.broadcast.to(room).emit("user-connected", peerList, peerObj.id);
      socket.emit("name", nameList);
      socket.emit("pushToLs", peerList);
      nameList = [];
    }
  });
 

  socket.on("stop-call", (room, userId) => {
    console.log("hello");
    socket.broadcast.to(room).emit("disconnect-mediaconnection", userId);
  });
  socket.on("leave-room",(room,userId)=>{
    console.log("left room",userId)
    socket.leave(room);
    socket.broadcast.to(room).emit("user-disconnected", userId);
    peerList =[];

  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
