import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Create Room");
  }
  async getHtml() {
    return ` 
    <main class="createRoom">
      <aside class="createRoom__aside"> 
      <h3>Rooms</h3>
          <li class="createRoom__list" id="displayRoomName"></li>
        <p id="roomHolder"></p>

        <button class="button--light" id="refresh"> Refresh rooms list </button>
      </aside>
      
      <article class="createRoom__form"> 
        <h3 for="input">Create new room</h3>
        <input class="createRoom__input" id="roomNameInput" type="text"/>
        <button class="button--light" id="roomNameButton">Create</button>
        <p id="alert"></p>

    </article>
    
    
    </main>    
       <style>
      #video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-auto-rows: 300px;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    </style>

    `;
  }
}
