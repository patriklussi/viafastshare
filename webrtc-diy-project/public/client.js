const connectToUser = document.querySelector("#roomButton");
const displayRoomName = document.querySelector("#displayRoomName");
const roomNameButton = document.querySelector("#roomNameButton");
const videoGrid = document.getElementById("videoGrid");
const roomHolder = document.querySelector("#roomHolder");
const buttonBox = document.querySelector("#buttonBox");

const socket = io();
const peers = {};

var myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});
var userIdYes;
myPeer.on("open", function (id) {
  console.log("My peer id", id);
  userIdYes = id;
});

var showRoomName;

window.onload = function () {
  socket.emit("sendArrayInfo");
};

socket.on("sendRoomArray", (roomList) => {
  console.log("RoomList", roomList);
  for (let room of roomList) {
    const roomName = document.createElement("p");

    roomName.innerHTML = room;

    displayRoomName.append(roomName);

    showRoomName = room;
    roomName.addEventListener("click", () => {
      socket.emit("join-room", userIdYes, room);
    });
  }
});

roomNameButton.addEventListener("click", () => {
  const roomNameInput = document.querySelector("#roomNameInput");
  const room = roomNameInput.value;
  socket.emit("room-name", room);
  console.log("Userid", userIdYes);

  socket.emit("sendArrayInfo");
});
socket.on("user-connected", (userId) => {
  connectToAnotherUser(userId);
  console.log("user " + userId + " has connected");
  console.log("Current Peer", peers);
  const li = document.createElement("li");
  li.innerHTML = "User" + userId + "has connected to" + " " + showRoomName;
  roomHolder.append(li);
});

constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};
var connectedUserId;
function connectToAnotherUser(userId) {
  /*
  var conn = myPeer.connect(userId);
  */
  connectedUserId = userId;
  let button = document.createElement("button");
  button.innerText = "Share screen";
  buttonBox.append(button);
  button.addEventListener("click", () => {
    shareMedia();
  });

}

/*
myPeer.on("connection", function (conn) {
  let button = document.createElement("button");
  button.innerText = "Share screen";
  buttonBox.append(button);
  button.addEventListener("click", () => {
    shareMedia();
  });
});
*/

let streamTracks;

async function shareMedia() {
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());

    var call = myPeer.call(connectedUserId, stream);
    window.srcObject = stream;
  });
}

myPeer.on("call", (call) => {
  call.answer();
  let video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[connectedUserId] = call;
  console.log("CALL",call)
  console.log("Current Peer", peers);
});

function addVideoStream(video, userVideoStream) {
  video.srcObject = userVideoStream;
  video.play();
  videoGrid.append(video);
  console.log("Current Peer", peers);
}

/*
function addVideoStream(video, stream) {
  video.srcObject = stream;
  window.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

/*
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}
*/
