import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Room");
  }

  async getHtml() {
    return `
 
    <div id="videoGrid"> </div>
    <button id="shareButton"> Start sharing </button>
    <button id="stopShareButton"> Stop sharing </button>
    <button id="disconnectButton"> Disconnect </button>
    
    `;
  }
}
