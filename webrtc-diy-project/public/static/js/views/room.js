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
        <h3 class="nav__header" id="roomTitle"></h3>
        <h2 id="usersInRoom"> </h2>
        <p id="roomHolder"></p>
        <a class="button--light button--small"  id="disconnectButton"  href="/createRoom" data-link>Leave room </a> 
        <h2 id="nameHolder">${this.getUserName()}</h2>
      </aside>
  
      <section class="room__video">
        <div id="videoGrid" class="video"> </div>
        <article class="room__options">  
          <button id="shareButton" class="button--light" > Start sharing </button>
    

        </article>
      </section>
      
    
    </main>
    `;
  }
}
