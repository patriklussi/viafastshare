const connectToUser = document.querySelector("#roomButton");

const socket = io();
const pHolder = document.querySelector("#pId");
const roomNameButton = document.querySelector("#roomNameButton");
const videoGrid = document.getElementById("videoGrid");
const roomHolder = document.querySelector("#roomHolder");
const buttonBox = document.querySelector("#buttonBox");
const peers = {};
let userMediaStream;
var roomListTwo = [];
const senders = [];
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
    const displayRoomName = document.createElement("p");

    displayRoomName.innerHTML = room;

    pHolder.append(displayRoomName);

    showRoomName = room;
    displayRoomName.addEventListener("click", () => {
      /*userMediaStream
        .getTracks()
        .forEach((track) =>
          senders.push(myPeer.addTrack(track, userMediaStream))
        );*/
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
var newUserId;
async function connectToAnotherUser(userId) {
  var conn = myPeer.connect(userId);
  newUserId = userId;
 

  /*
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
 */
}
var connCounter = 0;

myPeer.on("connection", function (conn) {
  let button = document.createElement("button");
  button.innerText = "Share screen";
  buttonBox.append(button);
  button.addEventListener("click", () => {
    shareMedia();
  });
});


let streamTracks;

async function shareMedia() {
  navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
    console.log(stream.getTracks());
    
    var call = myPeer.call(newUserId, stream);
    window.srcObject = stream;
  });
}


myPeer.on("call",(call)=>{
  call.answer(window.srcObject);
  let video = document.createElement("video");
call.on("stream", (userVideoStream) => {
  addVideoStream(video, userVideoStream);
});
call.on("close", () => {
  video.remove();
});
peers[newUserId] = call;

})




function addVideoStream(video,userVideoStream){

  console.log(video);
  video.srcObject = userVideoStream;
    video.play();
    videoGrid.append(video);
}
/*{
  if (!displayMediaStream) {
    displayMediaStream = await navigator.mediaDevices.getDisplayMedia();
  }
  senders
    .find((sender) => sender.track.kind === "video")
    .replaceTrack(displayMediaStream.getTracks()[0]);
  document.getElementById("video-grid").srcObject = displayMediaStream;
}*/
/*
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
*/

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
