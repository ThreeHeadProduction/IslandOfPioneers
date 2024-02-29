const socket = io();

function login () {

        let username = document.getElementById('username')
        let password = document.getElementById('password')
        
        socket.emit('login', {username:username.value, password:password.value})
}  

function register () {

        let email = document.getElementById('email')
        let username = document.getElementById('username')

        document.getElementById('repeatpassword').addEventListener('input', function() {
                var password = document.getElementById('password').value;
                var repeatPassword = this.value;
              
                if (password !== repeatPassword) {
                  this.classList.add('error');
                  document.getElementById('password').classList.add('error');
                } else {
                  this.classList.remove('error');
                  document.getElementById('password').classList.remove('error');
                  socket.emit('register', {email:email.value ,username:username.value, password:password.value})
                }
              });

}


socket.on('redirect', function(destination) {
        console.log("test");
        window.location.href = destination;
    });