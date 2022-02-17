import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Room");
  }
  getUserName() {
    return window.sessionStorage.getItem("names");
  }

  async getHtml() {
    return `
    <main id="mainRoom" class="room">
      
      <aside id="roomAside" class="room__aside"> 
      <p id="navBtn" class="nav__button">close</p>
        <h3 class="nav__header" id="roomTitle"> </h3>
        <section class="createRoom__roomContainer">
          <ul id="usersInRoom" class="createRoom__list" id="displayRoomName">

          </ul>
          <h2 id="usersInRoom"></h2>
          <a class="button--light button--small"  id="disconnectButton"  href="/createRoom" data-link>Leave room </a>
          </section>  
          <p id="roomHolder"></p>
           
        <section class="createRoom__userContainer">
          <h2 id="nameHolder" class="createRoom__user">${this.getUserName()} </h2>
        </section>
      </aside>
  
      <section class="room__video">
        <article id="whoIsSharingContainer" class="alert--dark"></article>
        <div id="videoGrid" class="video"> </div>
        <p id="alertShare" class="alert--dark" ></p>
        <article id="roomContorlOptions" class="room__options">  
          <button id="shareButton" class="button--light" > Start sharing </button>
    

        </article>
      </section>
      
    
    </main>
    `;
  }
}
