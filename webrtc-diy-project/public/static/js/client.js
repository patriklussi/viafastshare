const connectToUser = document.querySelector("#roomButton");
const nameHolder = document.querySelector("#nameHolder");
const roomNameButton = document.querySelector("#roomNameButton");
var nameOKBtn = document.getElementById("nameOKBtn");

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

document.addEventListener("click", (event) => {
  if (event.target.matches("#roomNameButton")) {
    const roomNameInput = document.querySelector("#roomNameInput");

    const room = roomNameInput.value;
    console.log("ROOM", room);
    socket.emit("room-name", room);
    console.log("Userid", userIdYes);
    //  socket.emit("join-room",  room);
    socket.emit("sendArrayInfo");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#refresh")) {
    console.log("dpes this work");
    socket.emit("sendArrayInfo");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#nameOKBtn")) {
    const enterName = document.querySelector("#enterName");
    console.log(enterName.value);
    const test = document.querySelector("#connectCondition");

    let enterNameValue = enterName.value;
    if (enterNameValue != "") {
      console.log("not empty");
      test.style.display = "block";
      nameHolder.innerHTML = "Du är inloggad som" + " " + enterNameValue;
    } else {
      console.log("empty");
    }
    console.log(enterNameValue);
    peerObj.name = enterNameValue;
    socket.emit("name-send", peerObj.name);
  }
});

socket.on("sendRoomArray", (roomList) => {
  const displayRoomName = document.querySelector("#displayRoomName");
  console.log("RoomList", roomList);
  displayRoomName.innerHTML = "";

  for (let room of roomList) {
    const roomName = document.createElement("a");
    roomName.setAttribute("href", "/room");
    roomName.classList.add("testButton");
    roomName.setAttribute("data-link", "  ");
    roomName.innerHTML = room;

    displayRoomName.append(roomName);

    showRoomName = room;

    roomName.addEventListener("click", () => {
      document.addEventListener("click", (e) => {
        if (e.target.matches(".testButton")) {
          socket.emit("join-room", peerObj, room);
          connectToAnotherUser(users);
        }
      });
    });
  }
});

socket.on("user-connected", (peerList, userId, peerName) => {
  users.push(userId);
  window.localStorage.setItem("peerList", JSON.stringify(peerList));
  console.log(users);
  console.log("user " + userId + " has connected");
  console.log("Current Peer", peers);
});

let constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};
var connectedUserId;

function connectToAnotherUser(users) {
  const roomTitle = document.querySelector("#roomTitle");
  roomTitle.append(showRoomName);
  const usersInRoom = document.querySelector("#usersInRoom");

  console.log("Room name", showRoomName);
  document.addEventListener("click", (event) => {
    if (event.target.matches("#shareButton")) {
      shareMedia();
    }
  });
}
socket.on("name", (nameList) => {
  console.log(nameList);
  usersInRoom.append(nameList);
});
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
  let peersToLoop = peerList.filter((peers) => {
    return peers !== userIdYes;
  });
  const stopButton = document.querySelector("#stopShareButton");
  stopButton.addEventListener("click", () => {
    console.log("stop");
  });

  console.log(peerList);
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());
    peersToLoop.forEach((id) => {
      var call = myPeer.call(id, stream);
    });

    window.srcObject = stream;
  });
}

document.addEventListener("click", (event) => {
  if (event.target.matches("#disconnectButton")) {
    socket.emit("leave-room", showRoomName, userIdYes);
    console.log("disconnect");
  }
});

socket.on("user-disconnected", (userId) => {
  window.call.close();
  //if (peers[userId]) peers[userId].close();
  console.log("User", userId, "has left the room");
});

myPeer.on("call", (call) => {
  call.answer();
  console.log("Call answered");
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream);
  });
  call.on("close", () => {
    console.log("Closing!");
    video.remove();
  });
  peers[connectedUserId] = call;
  console.log("CALL", call);
  console.log("Current Peer", peers);
});

function addVideoStream(userVideoStream) {
  let video = document.createElement("video");
  const videoGrid = document.getElementById("videoGrid");
  video.srcObject = userVideoStream;
  video.play();
  videoGrid.append(video);

  console.log("Current Peer", peers);
}

/*
function addVideoStream(video, setream) {
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
