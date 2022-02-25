const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

let roomList = [];
let peerList = [];

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  socket.emit("give-socket-id", socket.id);

  socket.on("send-RoomList-Info", () => {
    socket.emit("send-roomList", roomList);
  });

  socket.on("room-name", (room) => {
    if (roomList.includes(room)) {
      socket.emit("alert-room", room);
    } else {
      roomList.push(room);
    }
  });

  socket.on("join-room", (peerObj, room) => {
    if (peerList.includes(peerObj.id)) {
    } else {
      socket.join(room);
      peerObj.room = room;
      peerList.push(peerObj);
      socket.emit("updateNameDisplay", peerList, room);
      socket.broadcast
        .to(room)
        .emit("user-connected", peerList, peerObj.id, room);
      socket.emit("room-display", room);
    }
  });
  socket.on("call", (room) => {

    socket.emit("call-function", room, peerList);
  });

  socket.on("stop-call", (room, userId) => {
    socket.broadcast.to(room).emit("disconnect-mediaconnection", userId);
  });
  socket.on("delete-room", (room, userId) => {
    roomList = roomList.filter((roomName) => {
      return roomName !== room;
    });
    peerList = peerList.filter((peers) => {
      return peers.id === userId;
    });
   
  });

  function filterPeerList(userId) {
    peerList = peerList.filter((peers) => {
      return peers.id !== userId;
    });
  }

  socket.on("disconnect", () => {
    let peerId;
    let roomName;
    for (let peer of peerList) {
      if (peer.socketId === socket.id) {
        peerId = peer.id;
        roomName = peer.room;
        break;
      }
    }
    filterPeerList(peerId);
    socket.broadcast
      .to(roomName)
      .emit("user-disconnected", peerId, roomName, peerList);
  });

  socket.on("leave-room", (room, userId) => {
    console.log(peerList);
    socket.leave(room);
    filterPeerList(userId);
    console.log(peerList);
    socket.broadcast.to(room).emit("user-disconnected", userId, room, peerList);
  });
});

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
