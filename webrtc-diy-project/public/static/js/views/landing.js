import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Landing");
  }

  async getHtml() {
    return `
   
      <h1>Welcome to this share application</h1>
     
      <style>
      #connectCondition {
        display:none;
       
      }
      .show {
        display:block;
      }
      
     
    </style>
        <h3> Please enter your name </h3>
          <input type="text" id="enterName" />
          <button id="nameOKBtn" class="button" >Add your name</button>
          <a id="connectCondition" href="/createRoom" data-link>Connect </a> 
   
    `;
  }
}
