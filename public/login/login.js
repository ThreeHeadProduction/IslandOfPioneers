const socket = io();

function login () {

        let username = document.getElementById('username')
        let password = document.getElementById('password')
        
        socket.emit('login', {username:username.value, password:password.value})
}  
