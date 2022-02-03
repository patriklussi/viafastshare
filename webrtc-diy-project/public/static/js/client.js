const connectToUser = document.querySelector("#roomButton");

const roomNameButton = document.querySelector("#roomNameButton");
var nameOKBtn = document.getElementById("nameOKBtn");

const socket = io();
const ingoingMediaConnections = new Map();
const outgoingMediaConnections = new Map();
const users = [];
const peerObj = {};
var showRoomName;

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
/*
const roomNameInput = document.querySelector("#roomNameInput");
roomNameInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    console.log("testing enter press on input");
    event.preventDefault();
    //document.getElementById("#roomNameButton").click();
  }
});*/

let emptyArray = [];
document.addEventListener("click", (event) => {
  if (event.target.matches("#roomNameButton")) {
    const room = roomNameInput.value;
    console.log("New room created with name: ", room);
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
    console.log("does this work");
    socket.emit("sendArrayInfo");
  }
});
let emptyArrayTwo = [];
document.addEventListener("click", (event) => {
  if (event.target.matches("#nameOKBtn")) {
    const enterName = document.querySelector("#enterName");

    console.log("username " + enterName.value + " was created");
    window.sessionStorage.setItem("names", JSON.stringify(enterName.value));
    const test = document.querySelector("#connectCondition");
    const nameBtn = document.querySelector("#nameOKBtn");
    const info = document.querySelector("#registerInfo");

    let enterNameValue = enterName.value;
    if (enterNameValue != "") {
      //console.log("not empty");
      test.style.display = "block";
      nameBtn.style.display = "none";
      enterName.style.display = "none";
      info.innerHTML = "You're entering as " + enterNameValue;

      socket.emit("display-name");
      //  nameHolder.innerHTML = "Du är inloggad som" + " " + enterNameValue;
    } else {
      alertName();
    }

    //  socket.emit("name-send", peerObj.name);
    enterName.value = "";
  }
});

function displayUserName() {
  const nameHolder = document.querySelector("#nameHolder");
  let localName = JSON.parse(window.sessionStorage.getItem("names"));
  nameHolder.innerHTML = localName;
}

socket.on("name-display", () => {
  let name = JSON.parse(window.sessionStorage.getItem("names"));
});

var ClickedRoomName;
socket.on("sendRoomArray", (roomList) => {
  const displayRoomName = document.querySelector("#displayRoomName");
  displayUserName();
  displayRoomName.innerHTML = "";
  if (roomList.length === 0) {
    console.log("There is no rooms");
    alertRoomList();
  } else {
    for (let room of roomList) {
      console.log("roomooooooooooooooooooooooo", room);
      const roomName = document.createElement("a");
      roomName.setAttribute("href", "/room");
      roomName.classList.add("createRoom__list--item");
      roomName.setAttribute("data-link", "  ");
      roomName.innerHTML = room;

      displayRoomName.append(roomName);

      showRoomName = room;
      roomName.addEventListener("click", () => {
        console.log("Clicked on this room", room);
        console.log("CLICKED ROOM", room);
        let sessionName = JSON.parse(window.sessionStorage.getItem("names"));
        ClickedRoomName = room;
        peerObj.name = sessionName;
        socket.emit("send-name", sessionName, room);
        socket.emit("join-room", peerObj, room);
        socket.emit("clear");
        socket.emit("test", room);
      });
    }
  }
});

socket.on("call-function", (room) => {
  connectToAnotherUser(users, room);
});

socket.on("user-connected", (peerList, userId, room) => {
  console.log("PeerList", peerList);
  console.log(users);
  console.log("user " + userId + " has connected");
  console.log("Current mediaConnections", ingoingMediaConnections);
  console.log("ROOOM", room);
  updateUsers(room);
});

socket.on("room-display", function (room) {
  let roomTitle = document.querySelector("#roomTitle");
  roomTitle.innerHTML = room;
});

socket.on("pushToLs", (peerList, room) => {
  console.log(peerList);
  let temp = JSON.parse(window.localStorage.getItem(room));
  console.log(temp);
  console.log(peerList);
  temp = peerList;
  window.localStorage.setItem(room, JSON.stringify(temp));
  console.log("TEMP", temp);
  updateUsers(room);
});

let constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};

function updateUsers(room) {
  let peers = JSON.parse(window.localStorage.getItem(room));
  const usersInRoom = document.querySelector("#usersInRoom");
  console.log("pEERS", peers);
  usersInRoom.innerHTML = "";
  for (let peer of peers) {
    usersInRoom.append(peer.name);
  }
}

socket.on("message", (yes) => {
  console.log(yes);
});

function connectToAnotherUser(users, room) {
  const shareButton = document.querySelector("#shareButton");
  console.log(shareButton);
  console.log("Room name", room);
  document.addEventListener("click", (event) => {
    if (event.target.matches("#shareButton")) {
      if (shareButton.innerText == "Start sharing") {
        shareMedia(room);
        shareButton.innerHTML = "Stop sharing";
      } else {
        shareButton.innerHTML = "Start sharing";
        stopShare();
      }
    }
  });
}
/*
socket.on("name", (nameList) => {
  console.log(nameList);
  usersInRoom.append(nameList);
  console.log(usersInRoom);
});
*/

socket.on("alert-room", (roomName) => {
  const alert = document.querySelector("#alert");
  alert.innerHTML = " Room " + roomName + " already exists!";
  setTimeout(() => {
    alert.innerHTML = " ";
  }, 3000);
});

function alertRoomList() {
  const roomListAlert = document.querySelector("#roomAlertP");
  roomListAlert.innerHTML = "There are no rooms yet ";
  setTimeout(() => {
    roomListAlert.innerHTML = " ";
  }, 3000);
}

function alertName() {
  const alertName = document.querySelector("#alertName");
  alertName.innerHTML = "Please enter a name to continue";
  setTimeout(() => {
    alertName.innerHTML = " ";
  }, 3000);
}

async function shareMedia(room) {
  const peerList = JSON.parse(window.localStorage.getItem(room));
  let peersToLoop = peerList.filter((peers) => {
    return peers.id !== userIdYes;
  });

  console.log(peersToLoop.id);
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());
    peersToLoop.forEach((peer) => {
      var call = myPeer.call(peer.id, stream);
      outgoingMediaConnections.set(peer.id, call);
    });
    //window.stream = stream;
    window.srcObject = stream;
  });
}

function stopShare() {
  socket.emit("stop-call", showRoomName, userIdYes);
  console.log("Stop sharing");
  window.srcObject.getTracks().forEach(function (track) {
    track.stop();
  });
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
  console.log(window.stream);
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
  call.on("close", (userVideoStream) => {
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
    console.log("temp.length", temp.length);
    let newList = temp.filter((peers) => {
      return peers.id !== userIdYes;
    });
    console.log("newlist.length", newList.length);
    console.log("testar");
    window.localStorage.setItem(ClickedRoomName, JSON.stringify(newList));
  }
});

socket.on("user-disconnected", (userId, room) => {
  console.log("User", userId, "has disconnected");
  let peerList = JSON.parse(window.localStorage.getItem(room));
  peerList = peerList.filter((peers) => {
    return peers.id !== userId;
  });

  window.localStorage.setItem(room, JSON.stringify(peerList));
  if (peerList.length === 1) {
    let deleteBtn = document.querySelector("#disconnectButton");
    deleteBtn.innerHTML = "delete room";
    socket.emit("delete-room", room);
  }

  console.log("peerlist", peerList);
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
