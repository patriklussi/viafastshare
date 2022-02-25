# viafastshare 

Screen share application done as a javascript only **single page application** using **socket.io** and **peerjs**, deployed using **Heroku**. 

https://viafastshare.herokuapp.com/




___

## Developing 

Install dependencies 
````
npm install
````
___

Start development servers

###### Use two separate terminals

````
npm run start
````
````
peerjs --port 3001
````
___

###### **Client.js** during development set values to: 
````
const socket = io();
var myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});
````

## Deployment 

###### **Client.js** during deployment set values to: 

````
const socket = io("https://viafastshare.herokuapp.com/");
var myPeer = new Peer(undefined, {
  host: "0.peerjs.com",
  port: "443",
  config: { iceServers: [{ url: "stun:stun.l.google.com:19302" }] },
});

````
