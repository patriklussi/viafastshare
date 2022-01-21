import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Landing");
  }

  async getHtml() {
    return `
    <article id="nameOverlay" class="overlay">
      <h1>Welcome to this share application</h1>
      <div class="overlay-content">
        <h3> Please enter your name </h3>
          <input type="text" id="enterName" />
          <button id="nameOKBtn" data-link >Ok!</button>
      </div>
    </article>
    `;
  }
}
