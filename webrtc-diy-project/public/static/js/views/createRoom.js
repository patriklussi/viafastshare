import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Create Room");
  }
  async getHtml() {
    return ` 
      <label for="input">Add room name</label>
      <input id="roomNameInput" type="text" />
      <button id="roomNameButton">Create</button>

      <p id="displayRoomName"></p>

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


      <article id="buttonBox"></article>
      <ul id="roomHolder"></ul>
      <div id="videoGrid"> </div>

    `;
  }
}
