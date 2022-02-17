import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Landing");
  }

  async getHtml() {
    return `
   <main  id="landing" class="landing">
    <aside class="landing__card"> 
      <h1>Welcome <br> to this share application!</h1>
    </aside>
    <article class="landing__form">
      <h3 id="registerInfo"> Please enter your name! </h3>
      <svg width="282" height="5" viewBox="0 0 282 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.99104" y1="3.75003" x2="281.991" y2="1.7357" stroke="#404549" stroke-width="2.5"/>
      </svg>
        <input autocomplete="off" class="landing__input" placeholder="Name" type="text" id="enterName" />
        <button class="button" id="nameOKBtn" >Add your name</button>
        <p id="alertName" class="alert--dark"></p>
        <br>
        <a id="connectCondition" href="/createRoom" data-link> Ok! </a> 
      </article>
   </main>
    `;
  }
}
