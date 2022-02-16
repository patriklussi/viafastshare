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
        <input autocomplete="off" class="landing__input" placeholder="Name" type="text" id="enterName" />
        <button class="button" id="nameOKBtn" >Add your name</button>
        <p id="alertName" class="alert--dark"></p>
        <br>
        <a id="connectCondition" href="/createRoom" data-link>Connect </a> 
      </article>
    
   </main>
    `;
  }
}
