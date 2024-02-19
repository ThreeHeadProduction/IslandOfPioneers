


window.onload = function(){
    document.getElementById("username").textContent = getCookieValue('username');
}


function logOut(){
    socket.emit("logout", null);
}

socket.on('reloadPage', () => {
    window.location.reload();
});