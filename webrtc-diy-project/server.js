const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

roomList = [];
peerList = [];
anotherList = [];


app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("connected");
  

  socket.on("sendArrayInfo", () => {
    socket.emit("sendRoomArray", roomList);
  });

  socket.on("room-name", (room) => {
    if (roomList.includes(room)) {
      socket.emit("alert-room", room);
    } else {
      console.log(peerList);
      roomList.push(room);
      peerList = [];
    }
  });
  /*
  socket.onAny((eventName, ...args) => {
    console.log("Hello is this working");
    socket.emit("updateName");
  });
  */
 socket.on("testing",(userId)=>{
   anotherList.push(userId);
  
 })

  socket.on("join-room", (peerObj, room) => {
    console.log("UserID", peerObj);
    if (peerList.includes(peerObj.id)) {
    } else {
      console.log("joined room: ", peerObj.id, room);
      console.log(peerList);
      socket.join(room);
      peerObj.room = room;
      peerList.push(peerObj);
      console.log(peerList);
      socket.emit("pushToLs", peerList, room);
      socket.emit("updateNameDisplay", room);
      socket.broadcast
        .to(room)
        .emit("user-connected", peerList, peerObj.id, room);
      socket.emit("room-display", room);
    }
  });
  socket.on("call", (room) => {
    console.log("clicked room: ", room);
    socket.emit("call-function", room);
  });

  socket.on("stop-call", (room, userId) => {
    socket.broadcast.to(room).emit("disconnect-mediaconnection", userId);
  });
  socket.on("delete-room", (room) => {
    roomList = roomList.filter((roomName) => {
      return roomName !== room;
    });
    console.log("removed room:", roomList);
  });

  socket.on("disconnect", () => {
    console.log(peerList);
   
      console.log(peerList);
    console.log("disconnected", socket.id);
    console.log("Testar disconnect on refresh");
  });
  

    


  socket.on("leave-room", (room, userId) => {
    console.log(userId, "left room");
    socket.leave(room);
    socket.broadcast.to(room).emit("user-disconnected", userId, room);
    peerList = peerList.filter((peers) => {
      return peers.id !== userId;
    });
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
