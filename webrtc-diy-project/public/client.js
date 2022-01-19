const connectToUser = document.querySelector("#roomButton");
const displayRoomName = document.querySelector("#displayRoomName");
const roomNameButton = document.querySelector("#roomNameButton");
const videoGrid = document.getElementById("videoGrid");
const roomHolder = document.querySelector("#roomHolder");
const buttonBox = document.querySelector("#buttonBox");

const socket = io();
const peers = {};
const users = [];
const peerObj = {};

var myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});
var userIdYes;
myPeer.on("open", function (id) {
  console.log("My peer id", id);
  userIdYes = id;
  peerObj.id = userIdYes;
  console.log(peerObj);
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
      socket.emit("join-room", peerObj, room);
      connectToAnotherUser(users);
    });
  }
});

nameOKBtn.addEventListener("click", () => {
  const enterName = document.querySelector("#enterName");
  let enterNameValue = enterName.value;
  if (enterNameValue === null) {
    console.log("enterd name value was null");
  }
  peerObj.name = enterNameValue;
  console.log(peerObj);
  document.getElementById("nameOverlay").style.display = "none";
});

roomNameButton.addEventListener("click", () => {
  const roomNameInput = document.querySelector("#roomNameInput");
  const room = roomNameInput.value;
  socket.emit("room-name", room);
  console.log("Userid", userIdYes);
  socket.emit("join-room", peerObj, room);
  socket.emit("sendArrayInfo");
});

socket.on("user-connected", (peerList, userId, peerObj) => {
  users.push(userId);
  window.localStorage.setItem("peerList", JSON.stringify(peerList));
  console.log(users);
  console.log(peerList);
  console.log("user " + userId + " has connected");
  console.log("Current Peer", peers);
  const li = document.createElement("li");
  li.innerHTML =
    "User" + peerObj.name + "has connected to" + " " + showRoomName;
  roomHolder.append(li);
});

constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};
var connectedUserId;
function connectToAnotherUser(users) {
  /*
  var conn = myPeer.connect(userId);
  */
  connectedUserId = users;
  let button = document.createElement("button");
  button.innerText = "Share screen";
  buttonBox.append(button);
  button.addEventListener("click", () => {
    shareMedia(connectedUserId);
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
 const peerList = JSON.parse(window.localStorage.getItem("peerList"));

  console.log(peerList);
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());
    peerList.forEach((id) => {
      var call = myPeer.call(id, stream);
      console.log("hejhej");
    });

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
  console.log("CALL", call);
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
