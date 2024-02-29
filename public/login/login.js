const socket = io();

function login() {

  let username = document.getElementById('username')
  let password = document.getElementById('password')

  console.log("im here");

  socket.emit('login', { username: username.value, password: password.value })
}

function register() {

  let email = document.getElementById('email').value
  let username = document.getElementById('username').value

  var password = document.getElementById('password').value;
  var repeatPassword = document.getElementById('repeatpassword').value;

  if (password !== repeatPassword) {
    document.getElementById("repeatpassword").classList.add('error');
    document.getElementById('password').classList.add('error');
    document.getElementById("repeatpassword").classList.remove('node');
    document.getElementById('password').classList.remove('node');
    console.log("Wrong pw");
  } else {
    document.getElementById("repeatpassword").classList.remove('error');
    document.getElementById('password').classList.remove('error');
    document.getElementById("repeatpassword").classList.add('node');
    document.getElementById('password').classList.add('node');
    socket.emit('register', { email: email, username: username, password: password })
    console.log(username)
    console.log("Right pw");
  }
}

socket.on('redirect', function (destination) {
  console.log("test");
  window.location.href = destination;
});