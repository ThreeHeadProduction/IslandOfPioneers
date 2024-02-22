const socket = io();

window.onload = function () {
    document.getElementById("username").textContent = getCookieValue('username');
}

function logout() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("optionMenu").style.display = "none";
    document.getElementById("searchMenu").style.display = "none";
    socket.emit("logout");
    history.pushState({}, '', '/main');
}


socket.on('menuArea', (data) => {
    console.log(data);
    if (data === "optionMenu") openOptions();
    else if (data === "searchMenu") searchLobby();
    else {

        document.getElementById("menu").style.display = "flex";
        document.getElementById("optionMenu").style.display = "none";
        document.getElementById("searchMenu").style.display = "none";
    }

});



function openOptions() {


    history.pushState({}, '', '/main/optionMenu');
    document.getElementById("menu").style.display = "none";
    document.getElementById("optionMenu").style.display = "flex";
    document.getElementById("searchMenu").style.display = "none";
}



function searchLobby() {


    history.pushState({}, '', '/main/searchLobby');
    document.getElementById("menu").style.display = "none";
    document.getElementById("searchMenu").style.display = "flex";
    document.getElementById("optionMenu").style.display = "none";


}

function backMenu() {

    history.pushState({}, '', '/main');
    document.getElementById("menu").style.display = "flex";
    document.getElementById("searchMenu").style.display = "none";
    document.getElementById("optionMenu").style.display = "none";
}


socket.on('reloadPage', () => {
    window.location.reload();
});