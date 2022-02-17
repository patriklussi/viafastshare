const roomNameButton = document.querySelector("#roomNameButton");
var nameOKBtn = document.getElementById("nameOKBtn");
let deleteRoomBtn = document.createElement("a");
deleteRoomBtn.setAttribute("id", "deleteButton");
deleteRoomBtn.setAttribute("href", "/createRoom");
deleteRoomBtn.classList.add("button--light", "button--small");
deleteRoomBtn.setAttribute("data-link", "  ");

const socket = io("https://viafastshare.herokuapp.com/");
//const socket = io();
const ingoingMediaConnections = new Map();
const outgoingMediaConnections = new Map();
const peerObj = {};
let emptyArray = [];

var showRoomName;

var myPeer = new Peer(undefined, {
  host: "0.peerjs.com",
  //host: "/",
  port: "443",
  //port: "3001",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});
var userIdYes;
myPeer.on("open", function (id) {
  console.log("My peer id", id);
  userIdYes = id;
  peerObj.id = userIdYes;
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

socket.on("test-message", (peerList, text) => {
  console.log(peerList, text);
});

socket.on("sendTest", (peerList) => {
  console.log("Peerlist", peerList);
});

document.addEventListener("click", (event) => {
  if (event.target.matches("#roomNameButton")) {
    const room = roomNameInput.value;
    console.log("New room created with name: ", room);
    socket.emit("room-name", room);
    socket.emit("sendArrayInfo");
    roomNameInput.value = "";
    window.localStorage.setItem(room, JSON.stringify(emptyArray));
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

var ClickedRoomName;
socket.on("sendRoomArray", (roomList) => {
  const displayRoomName = document.querySelector("#displayRoomName");
  // displayUserName();
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

socket.on("call-function", (room) => {
  connectToAnotherUser(room);
});

socket.on("user-connected", (peerList, userId, room) => {
  console.log("PeerList: ", peerList);
  console.log("user " + userId + " has connected");
  console.log("Current mediaConnections: ", ingoingMediaConnections);
  console.log("HELLO THERE");
  deleteRoomBtn.remove();
  pushToLocalStorage(peerList, room);
  updateUsers(room);
  console.log("before");
});
function pushToLocalStorage(peerList, room) {
  let temp = JSON.parse(window.localStorage.getItem(room));
  temp = peerList;
  window.localStorage.setItem(room, JSON.stringify(temp));
  // updateUsers(room);
  console.log("after");
}

socket.on("room-display", function (room) {
  let roomTitle = document.querySelector("#roomTitle");
  roomTitle.innerHTML = room;
});

socket.on("pushToLs", (peerList, room) => {
  pushToLocalStorage(peerList, room);
});

socket.on("updateNameDisplay", (room) => {
  updateUsers(room);
});

let constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};

function updateUsers(room) {
  console.log("ROOM NAME", room);
  let peers = JSON.parse(window.localStorage.getItem(room));
  const usersInRoom = document.querySelector("#usersInRoom");
  console.log("PEERS", peers);
  usersInRoom.innerHTML = "";
  for (let peer of peers) {
    let userNameList = document.createElement("li");
    if (peer.room === room) {
      console.log("OLD", peers);
      peers = peers.filter((peer) => {
        return peer.room === room;
      });
      console.log("NEW", peers);
      window.localStorage.setItem(peer.room, JSON.stringify(peers));
      userNameList.innerHTML = peer.name;
      usersInRoom.append(userNameList);
    }
  }
}

socket.on("updateName", () => {
  console.log("hello");
  displayUserName();
});

function connectToAnotherUser(room) {
  let peerList = JSON.parse(window.localStorage.getItem(room));
  const shareButton = document.querySelector("#shareButton");
  let roomUsersList = document.querySelector(".createRoom__roomContainer");
  if (peerList.length === 1) {
    console.log("EHJAWHJDhj");

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
        shareMedia(room, alertYouAreSharing);
        shareButton.innerHTML = "Stop sharing";
        alertYouAreSharing.innerHTML = "You are sharing your screen!";
      } else if (shareButton.innerText == "Stop sharing") {
        shareButton.innerHTML = "Start sharing";
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

async function shareMedia(room, alertYouAreSharing) {
  const peerList = JSON.parse(window.localStorage.getItem(room));
  let peersToLoop = peerList.filter((peers) => {
    return peers.id !== userIdYes;
  });
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    peersToLoop.forEach((peer) => {
      var call = myPeer.call(peer.id, stream);
      outgoingMediaConnections.set(peer.id, call);
      stream.getTracks().forEach(function (track) {
        track.addEventListener("ended", () => {
          shareButton.innerText = "Start sharing";
          alertYouAreSharing.innerHTML = "";
          stopShare();
        });
      });
    });
    window.srcObject = stream;
  });
}

//window.srcObject.getVideoTracks()[0].addEventListener('ended', () => console.log('screensharing has ended'))
/*
window.srcObject.getTracks().forEach(function (track) {
  track.addEventListener("ended",()=>{
    console.log("stopped stream");
  });

});
*/

function stopShare() {
  socket.emit("stop-call", showRoomName, userIdYes);
  console.log("Stop sharing");
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

window.reload = function () {
  socket.emit("disconnect", ClickedRoomName, userIdYes);
};

myPeer.on("call", (call) => {
  let caller = document.createElement("p");
  let video = document.createElement("video");
  video.setAttribute("id", "videoTag");
  let fsButton = document.createElement("button");
  fsButton.innerHTML = "Fullscreen";
  fsButton.setAttribute("id", "fsButton");
  fsButton.classList.add("button--light");
  ingoingMediaConnections.set(call.peer, call);
  call.answer();
  console.log("Call answered", call.peer);
  let callingPeer = call.peer;
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, video, fsButton, callingPeer, caller);
  });

  call.on("close", () => {
    console.log("Closing!");
    video.remove();
    caller.innerHTML = "";
    fsButton.remove();
  });
});

function addVideoStream(userVideoStream, video, fsButton, callingPeer, caller) {
  let roomAside = document.querySelector("#whoIsSharingContainer");
  const peerList = JSON.parse(window.localStorage.getItem(ClickedRoomName));
  for (let peers of peerList) {
    if (peers.id === callingPeer) {
      caller.innerHTML = peers.name + " is sharing";
    }
  }

  const videoGrid = document.getElementById("videoGrid");
  video.srcObject = userVideoStream;

  video.play();
  videoGrid.append(video);
  videoGrid.append(fsButton);
  roomAside.append(caller);
}

document.addEventListener("click", (event) => {
  if (event.target.matches("#disconnectButton")) {
    if (window.srcObject != null) {
      window.srcObject.getTracks().forEach(function (track) {
        stopShare();
      });
    }

    socket.emit("leave-room", ClickedRoomName, userIdYes);
    let ls = window.localStorage.getItem(ClickedRoomName);
    let temp = JSON.parse(ls);
    let newList = temp.filter((peers) => {
      return peers.id !== userIdYes;
    });
    window.localStorage.setItem(ClickedRoomName, JSON.stringify(newList));
  }
});

socket.on("user-disconnected", (userId, room) => {
  console.log("User", userId, "has disconnected");
  let peerList = JSON.parse(window.localStorage.getItem(room));
  peerList = peerList.filter((peers) => {
    return peers.id !== userId;
  });

  updateUsers(ClickedRoomName);
  window.localStorage.setItem(room, JSON.stringify(peerList));
  //let deleteBtn = document.querySelector("#disconnectButton");

  let roomAside = document.querySelector(".createRoom__roomContainer");
  if (peerList.length === 1) {
    deleteRoomBtn.innerHTML = "Delete room";
    roomAside.append(deleteRoomBtn);
    deleteRoomBtn.addEventListener("click", () => {
      socket.emit("delete-room", room);
    });
  }
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
    document.getElementById("disconnectButton").style.display = "flex";
    document.getElementById("roomTitle").style.display = "block";
    document.getElementById("usersInRoom").style.display = "block";
    document.getElementById("nameHolder").style.display = "block";
    document.getElementById("svgLine").style.display = "block";
    deleteRoomBtn.style.display = "flex";
  } else {
    toggleNav.innerHTML = "Open";
    document.getElementById("roomAside").style.width = "80px";
    document.getElementById("navBtn").style.alignSelf = "center";
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
