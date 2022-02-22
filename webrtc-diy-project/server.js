const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let roomList = [];
let peerList = [];
let anotherList = [];


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

      socket.join(room);
      peerObj.room = room;
      peerList.push(peerObj);
      console.log(peerList);
      socket.emit("pushToLs", peerList, room);
      socket.emit("updateNameDisplay",peerList, room);
      socket.broadcast
        .to(room)
        .emit("user-connected", peerList, peerObj.id, room);
      socket.emit("room-display", room);
    }
  });
  socket.on("call", (room) => {
    console.log("clicked room: ", room);
    socket.emit("call-function", room,peerList);
  });

  socket.on("stop-call", (room, userId) => {
    socket.broadcast.to(room).emit("disconnect-mediaconnection", userId);
  });
  socket.on("delete-room", (room,userId) => {
    roomList = roomList.filter((roomName) => {
      return roomName !== room;
    });

    peerList = peerList.filter((peers) => {
      return peers.id === userId;
    });
    console.log("NEW PEERLISTD 2",peerList); 

    console.log("removed room:", roomList);
  });

  socket.on("disconnect", () => {
    console.log(peerList);
   
      console.log(peerList);
    console.log("disconnected", socket.id);
    console.log("Testar disconnect on refresh");
  });
  

   console.log(peerList);


  socket.on("leave-room", (room, userId) => {
    console.log(userId, "left room");
    socket.leave(room);
    console.log("PEERLIST BEFORE",peerList);
    
    peerList = peerList.filter((peers) => {
      return peers.id !== userId;
    });
    //socket.emit("updatesLeaverList",peerList,room);
    console.log("PEERLIST AFTER",peerList);
    socket.broadcast.to(room).emit("user-disconnected", userId, room,peerList);
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
