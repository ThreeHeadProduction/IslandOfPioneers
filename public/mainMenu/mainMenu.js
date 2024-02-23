const socket = io();

window.onload = function () {
  document.getElementById("username").textContent = getCookieValue("username");
  const currentArea = localStorage.getItem("currentArea");
  if ("/main/optionMenu" == currentArea) optionMenu();
  else if ("/main/searchLobby" == currentArea) searchMenu();
  else if ("/main" == currentArea) mainMenu();
};

function logout() {
  socket.emit("logout");
  history.pushState({}, "", "/");
}

function optionMenu() {
  history.pushState(null, null, "/main/optionMenu");
  localStorage.setItem("currentArea", "/main/optionMenu");
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("optionMenu").style.display = "flex";
}

function searchMenu() {
  history.pushState(null, null, "/main/searchLobby");
  localStorage.setItem("currentArea", "/main/searchLobby");
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("searchMenu").style.display = "flex";
}

function mainMenu() {
  history.pushState(null, null, "/main");
  localStorage.setItem("currentArea", "/main");
  document.getElementById("mainMenu").style.display = "flex";
  document.getElementById("searchMenu").style.display = "none";
  document.getElementById("optionMenu").style.display = "none";
}

socket.on("reloadPage", () => {
  window.location.reload();
});
