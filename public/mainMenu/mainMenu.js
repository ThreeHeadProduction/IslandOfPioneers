
// Set Username after successful login
window.onload = function () {
    document.getElementById("username").textContent = getCookieValue('username');
}

function logOut() {
    socket.emit("logout");
}

socket.on('reloadPage', () => {
    window.location.reload();
});

btn1;
btn2;

function openOptions() {

    document.getElementById("menu").style.display = "none";
    document.getElementById("option").style.display = "flex";

    btn2 = document.createElement("button");
    let t = document.createTextNode("Zurück");
    btn2.appendChild(t);
    btn2.className = "btn-select";
    document.getElementById("option").appendChild(btn2);
    btn2.setAttribute("onclick", "changeButtonText()");

}


function changeButtonText(){

    if (btn2) btn2.remove();
    document.getElementById("menu").style.display = "flex";
    document.getElementById("option").style.display = "none";
}



function searchLobby() {
    document.getElementById("searchLobby").style.display = "flex";
    document.getElementById("menu").style.display = "none";

    btn1 = document.createElement("button");
    let t = document.createTextNode("Test");
    btn1.appendChild(t);
    btn1.className = "btn-select";
    document.getElementById("searchLobby").appendChild(btn1);

}



function backMenu() {
    if (btn1) btn1.remove();
    document.getElementById("menu").style.display = "flex";
    document.getElementById("searchLobby").style.display = "none";
}

