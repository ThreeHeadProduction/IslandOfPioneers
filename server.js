const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const { checkLogin } = require('./backend/database');
const { createLobby, quickPlay } = require('./backend/lobbyHandler')
const session = require("express-session");
const cookieParser = require('cookie-parser');
const sessionMiddleware = session({
    secret: "BananenBrot123",
    resave: true,
    saveUninitialized: true,
});

app.use(cookieParser());
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


app.get('/main/lobby', (req, res) => {
    if (req.session.loggedIn == true) {
        if (req.session.lobbyID) {
            res.redirect('/main/lobby/' + req.session.lobbyID)
        } else {
            const lobby = createLobby()
            io.once('connection', (socket) => {
                if (socket.request.session.lobbyID === undefined) {
                    socket.join(lobby.id)
                    socket.request.session.lobbyID = lobby.id
                    socket.request.session.save()
                }
            })
            res.redirect('/main/lobby/' + lobby.id)
        }
    }
    else res.redirect('/');
})

app.get('/main/lobby/:lobby', (req, res) => {
    if (req.session.loggedIn == true) {
        res.sendFile(__dirname + '/views/lobby.html');
        io.once('connection', (socket) => {
            socket.emit('join-Lobby', socket.request.session.lobbyID)
        })
    }
    else res.redirect('/');
})

app.get('/main/quickplay', (req, res) => {
    if (req.session.loggedIn == true) {
        // Falls user  schon eine Lobby hat, wird er zu dieser redirected
        if (req.session.lobbyID) {
            res.redirect('/main/lobby/' + req.session.lobbyID)
        } else {
            // Eine Zufällige Lobby wird gesucht oder erstellt und zu dieser redirected
            const lobby = quickPlay()
            io.once('connection', (socket) => {
                if (socket.request.session.lobbyID === undefined) {
                    socket.join(lobby.id)
                    socket.request.session.lobbyID = lobby.id
                    socket.request.session.save()
                }
            })
            res.redirect('/main/lobby/' + lobby.id)
        }
    }
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

    socket.on('chat-message', (msg) => {
        io.to(req.session.lobbyID).emit('chat-message', msg)
    })
})

server.listen(80, () => console.log("Server is running on Port *:80"));