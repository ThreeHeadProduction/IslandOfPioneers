const socket = io();

function login() {

  let username = document.getElementById('username')
  let password = document.getElementById('password')

  console.log("im here");

  socket.emit('login', { username: username.value, password: password.value })
}


socket.on('redirect', function (destination) {
  console.log("test");
  window.location.href = destination;
});