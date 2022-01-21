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

      <article id="buttonBox"></article>
      <ul id="roomHolder"></ul>
      <video id="videoGrid"> </video>

    `;
  }
}
