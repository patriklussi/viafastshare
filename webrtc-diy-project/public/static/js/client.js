const roomNameButton = document.querySelector("#roomNameButton");
var nameOKBtn = document.getElementById("nameOKBtn");
let deleteRoomBtn = document.createElement("a");
deleteRoomBtn.setAttribute("id", "deleteButton");
deleteRoomBtn.setAttribute("href", "/createRoom");
deleteRoomBtn.classList.add("button--light", "button--small");
deleteRoomBtn.setAttribute("data-link", "  ");
var ClickedRoomName;
let constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};

var localPeerList = [];
let menuOpen = false;

//const socket = io("https://viafastshare.herokuapp.com/");
const socket = io();
const ingoingMediaConnections = new Map();
const outgoingMediaConnections = new Map();
const peerObj = {};

var showRoomName;

var myPeer = new Peer(undefined, {
  //host: "0.peerjs.com",
  host: "/",
  //port: "443",
  port: "3001",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});
var userIdYes;
myPeer.on("open", function (id) {
  console.log("My peer id", id);
  userIdYes = id;
  peerObj.id = userIdYes;
});
socket.on("give-id", (socketId) => {
  peerObj.socketId = socketId;
});

document.addEventListener("keyup", (event) => {
  if (event.target.matches("#roomNameInput")) {
    if (event.key === "Enter") {
      console.log("testar enter press on input");
      event.preventDefault();
      document.querySelector("#roomNameButton").click();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.target.matches("#enterName")) {
    if (event.key === "Enter") {
      console.log("testar enter press on input");
      event.preventDefault();
      document.querySelector("#nameOKBtn").click();
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#roomNameButton")) {
    if (roomNameInput.value !== "") {
      const room = roomNameInput.value;
      console.log("New room created with name: ", room);
      socket.emit("room-name", room);
      socket.emit("sendArrayInfo");
      roomNameInput.value = "";
    } else {
      socket.emit("sendArrayInfo");
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#refresh")) {
    socket.emit("sendArrayInfo");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#nameOKBtn")) {
    const enterName = document.querySelector("#enterName");
    console.log("username " + enterName.value + " was created");
    window.sessionStorage.setItem("names", enterName.value);
    const connectBtn = document.querySelector("#connectCondition");
    const nameBtn = document.querySelector("#nameOKBtn");
    const info = document.querySelector("#registerInfo");

    let enterNameValue = enterName.value;
    if (enterNameValue != "") {
      connectBtn.style.display = "block";
      nameBtn.style.display = "none";
      enterName.style.display = "none";
      info.innerHTML = "You're entering as " + enterNameValue;
    } else {
      alertName();
    }
    enterName.value = "";
  }
});

socket.on("sendRoomArray", (roomList) => {
  const displayRoomName = document.querySelector("#displayRoomName");
  displayRoomName.innerHTML = "";
  if (roomList.length === 0) {
    alertRoomList();
  } else {
    for (let room of roomList) {
      const roomName = document.createElement("a");
      roomName.setAttribute("href", "/room");
      roomName.classList.add("createRoom__list--item");
      roomName.setAttribute("data-link", "  ");
      roomName.innerHTML = room;

      displayRoomName.append(roomName);

      showRoomName = room;
      roomName.addEventListener("click", () => {
        console.log("CLICKED ROOM", room);
        let sessionName = window.sessionStorage.getItem("names");
        ClickedRoomName = room;
        peerObj.name = sessionName;
        socket.emit("send-name", sessionName, room);
        socket.emit("join-room", peerObj, room);
        socket.emit("clear");
        socket.emit("call", room);
      });
    }
  }
});

socket.on("call-function", (room, peerList) => {
  console.log("CONNECTOANOTHER USER PEERLIST", peerList);
  connectToAnotherUser(room, peerList);
});

socket.on("user-connected", (peerList, userId, room) => {
  console.log("PeerList: ", peerList);
  console.log("user " + userId + " has connected");
  console.log("Current mediaConnections: ", ingoingMediaConnections);
  deleteRoomBtn.remove();
  updateUsers(peerList, room);
  console.log("before");
});

socket.on("room-display", function (room) {
  let roomTitle = document.querySelector("#roomTitle");
  roomTitle.innerHTML = room;
});

socket.on("updateNameDisplay", (peerList, room) => {
  updateUsers(peerList, room);
});

function updateUsers(peerList, room) {
  console.log("PEERLIST", peerList);
  localPeerList = peerList;
  console.log("LocalPeerList", localPeerList);

  const usersInRoom = document.querySelector("#usersInRoom");

  usersInRoom.innerHTML = "";
  for (let peers of peerList) {
    let userNameList = document.createElement("li");
    if (peers.room === room) {
      userNameList.innerHTML = peers.name;
      usersInRoom.append(userNameList);
    }
  }
}

function connectToAnotherUser(room, peerList) {
  const shareButton = document.querySelector("#shareButton");
  let roomUsersList = document.querySelector(".createRoom__roomContainer");
  if (getNumberOfUsersInRoom(peerList, room) === 1) {
    deleteRoomBtn.innerHTML = "Delete room";
    roomUsersList.append(deleteRoomBtn);
    deleteRoomBtn.addEventListener("click", () => {
      socket.emit("delete-room", room);
    });
  }

  console.log("Room name: ", room);

  document.addEventListener("click", (event) => {
    if (event.target.matches("#shareButton")) {
      let alertYouAreSharing = document.querySelector("#alertShare");
      if (shareButton.innerText == "Start sharing") {
        shareMedia(room, localPeerList, alertYouAreSharing);
        shareButton.innerHTML = "Stop sharing";
        shareButton.classList.replace("button--light", "button");
        alertYouAreSharing.innerHTML = "You are sharing your screen!";
      } else if (shareButton.innerText == "Stop sharing") {
        shareButton.innerHTML = "Start sharing";
        shareButton.classList.remove("button");
        shareButton.classList.add("button--light");
        stopShare();
        alertYouAreSharing.innerHTML = "";
      }
    }
  });
}

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

function shareMedia(room, peerList, alertYouAreSharing) {
  console.log("PEERLIST CURRENT", peerList);
  let peersToLoop = peerList.filter((peers) => {
    return peers.id !== userIdYes;
  });
  navigator.mediaDevices
    .getDisplayMedia(constraints)
    .then((stream) => {
      peersToLoop.forEach((peer) => {
        console.log(peer);
        if (peer.room === room) {
          var call = myPeer.call(peer.id, stream);
          outgoingMediaConnections.set(peer.id, call);
          stream.getTracks().forEach(function (track) {
            track.addEventListener("ended", () => {
              shareButton.innerText = "Start sharing";
              alertYouAreSharing.innerHTML = "";
              stopShare();
            });
          });
        }
      });
      window.srcObject = stream;
    })
    .catch(function (err) {
      let alert = document.querySelector("#alertShare");
      let shareBtn = document.querySelector("#shareButton");
      shareBtn.classList.replace("button", "button--light");
      alert.innerHTML = "";
      shareBtn.innerHTML = "Start sharing";
    });
}

function stopShare() {
  socket.emit("stop-call", showRoomName, userIdYes);
  console.log("Stop sharing");
  let shareButton = document.querySelector("#shareButton");
  shareButton.classList.replace("button", "button--light");
  window.srcObject.getTracks().forEach(function (track) {
    track.stop();
  });
  outgoingMediaConnections.forEach((connection) => {
    if (connection.open) {
      connection.close();
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
  let caller = document.createElement("p");
  let video = document.createElement("video");
  video.setAttribute("id", "videoTag");
  let videoBar = document.createElement("div");
  videoBar.classList.add("video__bar");
  let fsButton = document.createElement("i");
  fsButton.setAttribute("id", "fsButton");
  fsButton.classList.add("material-icons");
  fsButton.style.fontSize = "36px";
  fsButton.style.color = "black";
  ingoingMediaConnections.set(call.peer, call);
  call.answer();
  console.log("Call answered", call.peer);
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, video, fsButton, caller, videoBar);
  });

  call.on("close", () => {
    console.log("Closing!");
    video.remove();
    caller.innerHTML = "";
    fsButton.remove();
    videoBar.remove();
  });
});

function addVideoStream(userVideoStream, video, fsButton, caller, videoBar) {
  let roomAside = document.querySelector("#roomAside");

  const videoGrid = document.getElementById("videoGrid");
  video.srcObject = userVideoStream;

  video.play();
  videoGrid.append(video);
  videoBar.append(fsButton);
  videoGrid.append(videoBar);
  roomAside.append(caller);
}

document.addEventListener("click", (event) => {
  if (event.target.matches("#disconnectButton")) {
    if (window.srcObject != null) {
      window.srcObject.getTracks().forEach(function (track) {
        track.stop();
        stopShare();
      });
    }

    socket.emit("leave-room", ClickedRoomName, userIdYes);
  }
});

socket.on("user-disconnected", (userId, room, peerList) => {
  console.log("User", userId, "has disconnected");
  updateUsers(peerList, room);
  let roomAside = document.querySelector("#roomAside");

  if (getNumberOfUsersInRoom(peerList, room) === 1) {
    deleteRoomBtn.innerHTML = "Delete room";
    roomAside.append(deleteRoomBtn);
    deleteRoomBtn.addEventListener("click", () => {
      socket.emit("delete-room", room, peerList, userIdYes);
    });
  }
});

function getNumberOfUsersInRoom(peerList, room) {
  let count = 0;
  for (let peer of peerList) {
    console.log(peer);
    if (peer.room === room) {
      count += 1;
    }
  }
  console.log("print count", count);
  return count;
}

document.addEventListener("click", (event) => {
  let menuButton = document.querySelector("#menuBtn");
  if (event.target.matches("#menuBtn")) {
    if (!menuOpen) {
      menuButton.classList.add("open");
      menuOpen = true;
      toggle(menuOpen);
    } else {
      menuButton.classList.remove("open");
      menuOpen = false;
      toggle(menuOpen);
    }
  }
});

function toggle(menuOpen) {
  if (menuOpen) {
    document.getElementById("roomAside").style.width = "250px";
    document.getElementById("disconnectButton").style.display = "flex";
    document.getElementById("roomTitle").style.display = "block";
    document.getElementById("usersInRoom").style.display = "block";
    document.getElementById("nameHolder").style.display = "block";
    document.getElementById("svgLine").style.display = "block";
    deleteRoomBtn.style.display = "flex";
  } else {
    document.getElementById("roomAside").style.width = "80px";
    document.getElementById("disconnectButton").style.display = "none";
    document.getElementById("roomTitle").style.display = "none";
    document.getElementById("usersInRoom").style.display = "none";
    document.getElementById("nameHolder").style.display = "none";
    document.getElementById("svgLine").style.display = "none";

    deleteRoomBtn.style.display = "none";
  }
}

document.addEventListener("click", (event) => {
  var elem = document.getElementById("videoTag");
  if (event.target.matches("#fsButton")) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }
});
