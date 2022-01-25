import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Landing");
  }

  async getHtml() {
    return `
   
    <section class="landing"> 
      <h1>Welcome to this share application</h1>
      <article class="landing__form">
        <h3> Please enter your name </h3>
          <input class="landing__input" type="text" id="enterName" />
          <button class="button" id="nameOKBtn">Add your name</button>
          <br>
          <a id="connectCondition" href="/createRoom" data-link>Connect </a> 
        </article>
    </section>
   
    `;
  }
}
