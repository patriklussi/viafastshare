import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Create Room");
  }

  getUserName() {
    return window.sessionStorage.getItem("names");
  }

  async getHtml() {
    return ` 
    <main id="mainCreateRoom" class="createRoom">
      <aside class="createRoom__aside"> 
        <h3 class="nav__header">Rooms</h3>
        <svg width="179" height="4" viewBox="0 0 179 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-3 2H179" stroke="#FEF8F8" stroke-width="2.5"/>
        </svg>

        <section class="room__container">
          <ul class="createRoom__list" id="displayRoomName">
            <li id="roomHolder"></li>
          </ul>
          <button class="button--light button--small" id="refresh"> Get rooms</button>
          <p id="roomAlertP" class="alert--light"></p>
        </section>  

        <section class="room__userContainer">
          <svg id="userIcon" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 31C1 25.375 8.5 25.375 12.25 21.625C14.125 19.75 8.5 19.75 8.5 10.375C8.5 4.12563 10.9994 1 16 1C21.0006 1 23.5 4.12563 23.5 10.375C23.5 19.75 17.875 19.75 19.75 21.625C23.5 25.375 31 25.375 31 31" stroke="#EBF2F7" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h2 id="nameHolder" class="createRoom__user">${this.getUserName()}</h2>
        </section>
      </aside>

      <article class="createRoom__form"> 
        <h3 for="input">Create new room</h3>
        <svg width="282" height="5" viewBox="0 0 282 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.99104" y1="3.75003" x2="281.991" y2="1.7357" stroke="#404549" stroke-width="2.5"/>
        </svg>
        <input placeholder="Room name" autocomplete="off" class="createRoom__input" id="roomNameInput" type="text"/>
        <button class="button--light" id="roomNameButton">Create</button>
        <p id="alert" class="alert--dark"></p>
      </article>
    </main>
    `;
  }
}
