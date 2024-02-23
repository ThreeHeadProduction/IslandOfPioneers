const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const { checkLogin } = require('./backend/database');
const session = require("express-session");
const { log } = require('console');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const sessionMiddleware = session({
    secret: "BananenBrot123",
    resave: true,
    saveUninitialized: true,
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

    if (req.session.loggedIn == true) res.redirect('/main');
    else res.sendFile(__dirname + '/views/login.html');
})

app.get('/main', (req, res) => {

    if (req.session.loggedIn == true) {

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        res.cookie('username', req.session.username, { expires: expirationDate });
        res.sendFile(__dirname + '/views/mainMenu.html');
    } else res.redirect('/');
})

app.get('/main/optionMenu', (req, res) => {

    if (req.session.loggedIn == true) res.sendFile(__dirname + '/views/mainMenu.html');
    else res.redirect('/');
})

app.get('/main/searchLobby', (req, res) => {

    if (req.session.loggedIn == true) res.sendFile(__dirname + '/views/mainMenu.html');
    else res.redirect('/');
})

io.on('connection', (socket) => {

    const req = socket.request;

    socket.on('login', (data) => {
        checkLogin(data.username, data.password)
            .then(result => {
                req.session.loggedIn = result.successful
                if (result.successful) {
                    req.session.username = result.data.username;
                }
                req.session.save()
                if (req.session.loggedIn == true) {
                    let destination = '/main';
                    socket.emit('redirect', destination);
                }
            })
    })

    socket.on('logout', (data) => {
        req.session.destroy();
        socket.emit('reloadPage');
    });
})

server.listen(80, () => console.log("Server is running on Port *:80"));