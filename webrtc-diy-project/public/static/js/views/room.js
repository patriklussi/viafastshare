import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Room");
  }

  async getHtml() {
    return `
    <main class="room">
      
      <aside id="roomAside" class="room__aside"> 
      <button id="navBtn" class="nav__button">close</button>
        <h3>Rooms</h3>
        <li class="room__list" id="displayRoomName"></li>
        <p id="roomHolder"></p>
        <button class="button--light" id="refresh"> Refresh rooms list </button>
      </aside>

      <h1 id="roomTitle"> </h1>
      <h2 id="usersInRoom"> </h2>
      <div id="videoGrid"> </div>
      <button id="shareButton"> Start sharing </button>
      <button id="stopShareButton"> Stop sharing </button>
      <button id="disconnectButton"> Disconnect </button>
    
    </main>
    `;
  }
}
