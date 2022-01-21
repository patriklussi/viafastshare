import abstractView from "./abstractView.js";

export default class extends abstractView {
  constructor() {
    super();
    this.setTitle("Room");
  }

  async getHtml() {
    return `
    <h1> Place holder for room name</h1>
    <div id="videoGrid"> </div>
    <button> Start sharing </button>
    <button> Stop sharing </button>
    <button> Disconnect </button>
    
    `;
  }
}
