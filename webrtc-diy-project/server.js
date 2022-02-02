const express = require("express");
const { copyFileSync } = require("fs");
const { SocketAddress } = require("net");
const path = require("path");
const { isObject } = require("util");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

roomList = [];
peerList = [];
nameList = [];

roomCompleteList = new Array(roomList.values(), nameList.values());
//const roomMap = new Map();
app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("sendArrayInfo", () => {
    socket.emit("sendRoomArray", roomList);
  });

  socket.on("send-name", (sessionName, room) => {
    if (nameList.includes(sessionName)) {
    } else {
      nameList.push(sessionName);
     // roomMap.set(room,nameList);
   
    }
    // socket.broadcast.to(room).emit("name-list",nameList);
    // socket.to(room).emit('name-list', nameList);
    io.emit("name-list", nameList, room);
  });

  socket.on("room-name", (room) => {
    if (roomList.includes(room)) {
      socket.emit("alert-room", room);
    } else {
      roomList.push(room);
      //socket.emit("trigger"); -------- ta bort?
      peerList = [];
    }
  });

  socket.on("display-name", () => {
    socket.emit("name-display");
  });
  /*
  socket.on("name-send", (name) => {
    nameList.push(name);
    console.log(nameList);
  });
  */

  socket.on("clear", () => {});

  socket.on("join-room", (peerObj, room) => {
    console.log("UserID", peerObj);
    if (peerList.includes(peerObj.id)) {
      console.log("nononono");
    } else {
      console.log("joined room", peerObj.id, room);
      console.log("nya arrayn ", roomCompleteList);
      socket.join(room);
      peerList.push(peerObj);
      socket.broadcast.to(room).emit("user-connected", peerList, peerObj);
      socket.emit("room-display", room);
      socket.emit("name", nameList);
      socket.emit("pushToLs", peerList, room);
    }
  });
  socket.on("test", (room) => {
    console.log("clickedROom", room);
    socket.emit("call-function", room);
  });

  socket.on("stop-call", (room, userId) => {
    console.log("hello");
    socket.broadcast.to(room).emit("disconnect-mediaconnection", userId);
  });
  socket.on("leave-room", (room, userId) => {
    console.log("left room", userId);
    socket.leave(room);
    socket.broadcast.to(room).emit("user-disconnected", userId);
    peerList = [];
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
