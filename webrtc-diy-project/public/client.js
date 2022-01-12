const connectToUser = document.querySelector("#roomButton");

const socket = io();
const pHolder = document.querySelector("#pId");
const roomNameButton = document.querySelector("#roomNameButton");
const videoGrid = document.getElementById("videoGrid");
const peers = {};

var roomListTwo = [];

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



window.onload = function () {
    socket.emit("sendArrayInfo");
};



socket.on("sendRoomArray", (roomList) => {
  console.log("RoomList", roomList);
  for (let room of roomList) {
    const displayRoomName = document.createElement("a");
    displayRoomName.setAttribute("href","/new-room");
    displayRoomName.innerHTML = room;
 
      pHolder.append(displayRoomName);
    
   

    displayRoomName.addEventListener("click", () => {
    
      socket.emit("join-room", userIdYes, room);
    });
  }
});

roomNameButton.addEventListener("click", () => {
  const roomNameInput = document.querySelector("#roomNameInput");
  const room = roomNameInput.value;
  socket.emit("room-name", room);
  console.log("Userid", userIdYes);
  console.log("roomname", room);
  socket.emit("join-room", userIdYes, room);
  socket.emit("sendArrayInfo");
});

/*
socket.on("addRoom", (room) => {
  roomListTwo.push(room);
  console.log(room);
  var ul = document.getElementById("roomHolder");
  var li = document.createElement("li");

  li.onclick = function () {
    roomListTwo.push(room);
  };

  li.appendChild(document.createTextNode(room));
  ul.appendChild(li);
});
*/

socket.on("user-connected", (userId) => {
  // connectToNewUser(userId,stream);
  connectToAnotherUser(userId);
  console.log("user " + userId + " has connected");
  console.log("Current Peer", peers);
});

constraints = {
  video: {
    cursor: "always" | "motion" | "never",
    displaySurface: "application" | "browser" | "monitor" | "window",
  },
};

async function connectToAnotherUser(userId) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    // var conn = myPeer.connect(userId);
    var call = myPeer.call(userId, stream);
    // on open will be launch when you successfully connect to PeerServer
    conn.on("open", function () {
      // here you have conn.id
      let conStr = "Hi from " + userId + "this is conn id" + conn.id;
      conn.send(conStr);
    });
  } catch (err) {
    console.log("something");
  }
}

myPeer.on("call", (call) => {
  answerToAnotherUser(call);
});

async function answerToAnotherUser(call) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  } catch (err) {
    console.log("ooga booga");
  }
}

myPeer.on("connection", function (conn) {
  conn.on("data", function (data) {
    // Will print 'hi!'
    console.log(data);
  });
});

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
