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
      <section class="createRoom__roomContainer">
          <ul class="createRoom__list" id="displayRoomName">
            <li id="roomHolder"></li>
          </ul>
        <button class="button--light button--small" id="refresh"> Refresh rooms list </button>
        <p id="roomAlertP" class="alert--light"></p>
      </section>  
        <section class="createRoom__userContainer">
          <h2 id="nameHolder" class="createRoom__user">${this.getUserName()}</h2>
        </section>
        </aside>

      <article class="createRoom__form"> 
        <h3 for="input">Create new room</h3>
        <input autocomplete="off" class="createRoom__input" id="roomNameInput" type="text"/>
        <button class="button--light" id="roomNameButton">Create</button>
        <p id="alert" class="alert--dark"></p>

      </article>
    </main>
    `;
  }
}
