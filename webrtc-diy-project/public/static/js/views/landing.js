import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Landing");
  }

  async getHtml() {
    return `
   
      <h1>Welcome to this share application</h1>
     
        <h3> Please enter your name </h3>
          <input type="text" id="enterName" />
          <button id="nameOKBtn"  ><a href="/createRoom" data-link>add name </a> </button>
   
    `;
  }
}
