import CreateRoom from "./views/createRoom.js";
import Landing from "./views/landing.js";
import Room from "./views/room.js";

const roomTitle = document.querySelector("#roomTitle");
console.log("Room",roomTitle);

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

let name = window.sessionStorage.getItem("names");

const router = async () => {
  const routes = [
    { path: "/", view: Landing },
    { path: "/createRoom", view: CreateRoom },
    { path: "/room", view: Room },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();
  document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

window.addEventListener("DOMContentLoaded", router);
if(name === null){
  navigateTo("/");
} else if(roomTitle === null){
  navigateTo("/createRoom");
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});
