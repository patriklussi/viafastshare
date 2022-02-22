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
      
      <i id="menuBtn" class="material-icons menu__btn open">chevron_right</i>
        <h3 class="nav__header" id="roomTitle"> </h3>
        <svg id="svgLine" width="179" height="4" viewBox="0 0 179 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-3 2H179" stroke="#FEF8F8" stroke-width="2.5"/>
        </svg>

        <section class="createRoom__roomContainer">
          <ul id="usersInRoom" class="createRoom__list" id="displayRoomName">

          </ul>
          <h2 id="usersInRoom"></h2>
          <a class="button--light button--small"  id="disconnectButton"  href="/createRoom" data-link>Leave room </a>
          </section>  
          <p id="roomHolder"></p>
           
        <section class="createRoom__userContainer">
        <svg id="userIcon" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 31C1 25.375 8.5 25.375 12.25 21.625C14.125 19.75 8.5 19.75 8.5 10.375C8.5 4.12563 10.9994 1 16 1C21.0006 1 23.5 4.12563 23.5 10.375C23.5 19.75 17.875 19.75 19.75 21.625C23.5 25.375 31 25.375 31 31" stroke="#EBF2F7" stroke-width="2" stroke-linecap="round"/>
        </svg>

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
