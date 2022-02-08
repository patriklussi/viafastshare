import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Create Room");
  }
  async getHtml() {
    return ` 
    <main id="mainCreateRoom" class="createRoom">
      <aside class="createRoom__aside"> 
      <h3 class="nav__header">Rooms</h3>
          <li class="createRoom__list" id="displayRoomName"></li>
        <p id="roomHolder"></p>

        <button class="button--light button--small" id="refresh"> Refresh rooms list </button>
        <p id="roomAlertP"></p>
        <h2 id="nameHolder"></h2>
      </aside>

      <article class="createRoom__form"> 
        <h3 for="input">Create new room</h3>
        <input autocomplete="off" class="createRoom__input" id="roomNameInput" type="text"/>
        <button class="button--light" id="roomNameButton">Create</button>
        <p id="alert"></p>

      </article>
    </main>
    `;
  }
}
