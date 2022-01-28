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
      <p id="navBtn" class="nav__button">close</p>
        <h3 class="nav__header" id="roomTitle"></h3>
        <h2 id="usersInRoom"> </h2>
        <p id="roomHolder"></p>
        <button class="button--light button--small" id="disconnectButton"> Leave room </button>
        <h2 id="nameHolder"></h2>
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
