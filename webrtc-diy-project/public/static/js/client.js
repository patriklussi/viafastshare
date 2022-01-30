const connectToUser = document.querySelector("#roomButton");
const nameHolder = document.querySelector("#nameHolder");
const roomNameButton = document.querySelector("#roomNameButton");
var nameOKBtn = document.getElementById("nameOKBtn");

const socket = io();
const ingoingMediaConnections = new Map();
const outgoingMediaConnections = new Map();
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
let emptyArray = [];
document.addEventListener("click", (event) => {
  if (event.target.matches("#roomNameButton")) {
    const roomNameInput = document.querySelector("#roomNameInput");
    const room = roomNameInput.value;
    let roomArray = [];
    console.log(room);
    console.log("ROOM", room);
    socket.emit("room-name", room);
    console.log("Userid", userIdYes);
    //  socket.emit("join-room",  room);
    socket.emit("sendArrayInfo");
    roomNameInput.value = "";
    window.localStorage.setItem(room, JSON.stringify(emptyArray));
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
    const nameBtn = document.querySelector("#nameOKBtn");

    let enterNameValue = enterName.value;
    if (enterNameValue != "") {
      console.log("not empty");
      test.style.display = "block";
      nameBtn.style.display = "none";
      //  nameHolder.innerHTML = "Du är inloggad som" + " " + enterNameValue;
    } else {
      alertName();
      console.log("empty");
    }
    console.log(enterNameValue);
    peerObj.name = enterNameValue;
    socket.emit("name-send", peerObj.name);
    enterName.value = "";
  }
});

var ClickedRoomName;
socket.on("sendRoomArray", (roomList) => {
  const displayRoomName = document.querySelector("#displayRoomName");
  console.log("RoomList", roomList);
  displayRoomName.innerHTML = "";
 
  console.log(nameHolder);
  for (let room of roomList) {
    const roomName = document.createElement("a");
    roomName.setAttribute("href", "/room");
    roomName.classList.add("createRoom__list--item");
    roomName.setAttribute("data-link", "  ");
    roomName.innerHTML = room;

    displayRoomName.append(roomName);

    showRoomName = room;

    document.addEventListener("click", (e) => {
      if (e.target.matches(".createRoom__list--item")) {
        console.log("THIS IS MY ROOM", room);
        ClickedRoomName = room;
        socket.emit("join-room", peerObj, room);
        socket.emit("clear");

        connectToAnotherUser(users);
      }
    });
  }
});

socket.on("user-connected", (peerList, userId, peerName) => {
  users.push(userId);
  console.log("PeerList", peerList);
  console.log(users);
  console.log("user " + userId + " has connected");
  console.log("Current mediaConnections", ingoingMediaConnections);
});

socket.on("pushToLs", (peerList) => {
  let temp = JSON.parse(window.localStorage.getItem(ClickedRoomName));
  console.log(temp);
  console.log(peerList);
  temp = peerList;
  window.localStorage.setItem(ClickedRoomName, JSON.stringify(temp));
});

let constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};


function connectToAnotherUser(users) {
  const roomTitle = document.querySelector("#roomTitle");

  roomTitle.innerHTML = ClickedRoomName;
 
  const usersInRoom = document.querySelector("#usersInRoom");

  const shareButton = document.querySelector("#shareButton");
  console.log(shareButton);

  console.log("Room name", showRoomName);

  document.addEventListener("click", (event) => {
    if (event.target.matches("#shareButton")) {
      if (shareButton.innerText == "Start sharing") {
        shareMedia();
        shareButton.innerHTML = "Stop sharing";
      } else {
        shareButton.innerHTML = "Start sharing";
        stopShare();
      }
    }
  });
}
socket.on("name", (nameList) => {
  console.log(nameList);
  usersInRoom.append(nameList);
  console.log(usersInRoom);
});

socket.on("alert-room", (roomName) => {
  const alert = document.querySelector("#alert");
  alert.innerHTML = " Room " + roomName + " already exists!";
  setTimeout(() => {
    alert.innerHTML = " ";
  }, 3000);
});

function alertName() {
  const alertName = document.querySelector("#alertName");
  alertName.innerHTML = "Please enter a name to continue";
  setTimeout(() => {
    alertName.innerHTML = " ";
  }, 3000);
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
var stopButtonVar;

async function shareMedia(shareButton, stopButton) {
  const peerList = JSON.parse(window.localStorage.getItem(showRoomName));
  let peersToLoop = peerList.filter((peers) => {
    return peers !== userIdYes;
  });

  console.log(peerList);
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());
    peersToLoop.forEach((id) => {
      var call = myPeer.call(id, stream);
      outgoingMediaConnections.set(id,call);
    });

    window.srcObject = stream;
  });
}

function stopShare(){
  socket.emit("leave-room", showRoomName, userIdYes);
  outgoingMediaConnections.forEach((connection)=>{
    console.log(connection);
    if(connection.open){
      connection.close();
    }
  })
  outgoingMediaConnections.clear();
    console.log("disconnect");
}


socket.on("user-disconnected", (userId) => {
  console.log("Disconnect mediaconnection",ingoingMediaConnections);
 // mediaConnections[userId].close();
  //if (peers[userId]) peers[userId].close();
  if(ingoingMediaConnections.has(userId)){
    console.log("Deleting connection from ",userId);
    ingoingMediaConnections.get(userId).close();
    ingoingMediaConnections.delete(userId);
  } else {
    console.log("has no connection from", userId);
  }

  
});

myPeer.on("call", (call) => {
  ingoingMediaConnections.set(call.peer,call);
  call.answer();
  console.log("Call answered");
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream);
  });
  call.on("close", () => {
    console.log("Closing!");
  //  video.remove();
  });
  console.log(call.peer);
 // mediaConnections[call.peer] = call;
  console.log("CALL", call);
 // console.log("Current Peer", mediaConnections);
});

function addVideoStream(userVideoStream) {
  let video = document.createElement("video");
  const videoGrid = document.getElementById("videoGrid");
  video.srcObject = userVideoStream;
  video.play();
  videoGrid.append(video);

//  console.log("Current mediaConnections", mediaConnections);
}
document.addEventListener("click", (event) => {
  if (event.target.matches("#navBtn")) {
    let toggleNav = document.getElementById("navBtn");
    toggle(toggleNav);
  }
});

function toggle(toggleNav) {
  if (toggleNav.innerHTML == "Open") {
    toggleNav.innerHTML = "Close";
    document.getElementById("roomAside").style.width = "250px";
    document.getElementById("navBtn").style.alignSelf = "flex-end";
    document.getElementById("disconnectButton").style.display = "block";
  } else {
    toggleNav.innerHTML = "Open";
    document.getElementById("roomAside").style.width = "80px";
    document.getElementById("navBtn").style.alignSelf = "center";
    document.getElementById("disconnectButton").style.display = "none";
  }
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
