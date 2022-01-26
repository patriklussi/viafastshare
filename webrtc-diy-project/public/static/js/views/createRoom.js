import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Create Room");
  }
  async getHtml() {
    return ` 

    <aside class="createRoom"> 
      
      <article class="createRoom__form"> 
      <h3 for="input">Add room name</h3>
      <input class="landing__input" id="roomNameInput" type="text"/>
      <button class="button" id="roomNameButton">Create</button>
      <p id="alert"></p>
    </article>
      <br>
      <button class="button" id="refresh"> Refresh rooms list </button>
      <br>
      <p id="displayRoomName"></p>
      <ul id="roomHolder"></ul>
    </aside>
    
    
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
