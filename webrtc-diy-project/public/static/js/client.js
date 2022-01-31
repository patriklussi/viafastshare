


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
    const info = document.querySelector("#registerInfo");

    let enterNameValue = enterName.value;
    if (enterNameValue != "") {
      console.log("not empty");
      test.style.display = "block";
      nameBtn.style.display = "none";
      enterName.style.display = "none";
      info.innerHTML = "You're entering as " + enterNameValue;
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
    console.log(room);
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
  console.log(ClickedRoomName);
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
      outgoingMediaConnections.set(id, call);
    });

    window.srcObject = stream;
  });
}

function stopShare() {
  socket.emit("stop-call", showRoomName, userIdYes);
  console.log("Stop sharing");
  outgoingMediaConnections.forEach((connection) => {
    console.log(connection);
    if (connection.open) {
      connection.close();
      console.log("it does  work");
    } else {
      console.log("it does not work");
    }
  });
  outgoingMediaConnections.clear();
  console.log("disconnect");
}

socket.on("disconnect-mediaconnection", (userId) => {
  console.log("Disconnect mediaconnection", ingoingMediaConnections);
  if (ingoingMediaConnections.has(userId)) {
    console.log("Deleting connection from ", userId);
    ingoingMediaConnections.get(userId).close();
    ingoingMediaConnections.delete(userId);
  } else {
    console.log("has no connection from", userId);
  }
});

myPeer.on("call", (call) => {
  let video = document.createElement("video");
  ingoingMediaConnections.set(call.peer, call);
  console.log("VIDEO", video);
  call.answer();
  console.log("Call answered");
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, video);
  });
  call.on("close", () => {
    console.log("Closing!");
    video.remove();
  });
  console.log(call.peer);
  // mediaConnections[call.peer] = call;
  console.log("CALL", call);
  // console.log("Current Peer", mediaConnections);
});



function addVideoStream(userVideoStream, video) {
  const videoGrid = document.getElementById("videoGrid");
  video.srcObject = userVideoStream;
  video.play();
  videoGrid.append(video);

  //  console.log("Current mediaConnections", mediaConnections);
}

document.addEventListener("click", (event) => {
  if (event.target.matches("#disconnectButton")) {
    socket.emit("leave-room", ClickedRoomName, userIdYes);
    let ls = window.localStorage.getItem(ClickedRoomName);
    let temp = JSON.parse(ls);
    let newList = temp.filter((peers)=>{
      return peers !== userIdYes;

    });
    window.localStorage.setItem(ClickedRoomName,JSON.stringify(newList));
  }
});

socket.on("user-disconnected",(userId)=>{
console.log("User", userId,"has disconnected");
});
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
    document.getElementById("roomTitle").style.display = "block";
    document.getElementById("usersInRoom").style.display = "none";
  } else {
    toggleNav.innerHTML = "Open";
    document.getElementById("roomAside").style.width = "80px";
    document.getElementById("navBtn").style.alignSelf = "center";
    document.getElementById("disconnectButton").style.display = "none";
    document.getElementById("roomTitle").style.display = "none";
    document.getElementById("usersInRoom").style.display = "none";
  }
}
