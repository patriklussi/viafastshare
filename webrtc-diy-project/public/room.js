const socket = io();


socket.on("user-connected", (userId) => {
    // connectToNewUser(userId,stream);
    connectToAnotherUser(userId);
    console.log("user " + userId + " has connected");
    console.log("Current Peer", peers);
  });
  

