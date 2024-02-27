const socket = io();

function login () {

        let username = document.getElementById('username')
        let password = document.getElementById('password')
        
        socket.emit('login', {username:username.value, password:password.value})
}  

function register () {

        let email = document.getElementById('email')
        let username = document.getElementById('username')
        let password = document.getElementById('password')
        let repeatpassword = document.getElementById('repeatpassword')

        if (password === repeatpassword){

                socket.emit('register', {email:email.value ,username:username.value, password:password.value})

        } else{

                this.classList.add('error');
                document.getElementById('password').classList.add('error');
                
        }
        
}


socket.on('redirect', function(destination) {
        console.log("test");
        window.location.href = destination;
    });