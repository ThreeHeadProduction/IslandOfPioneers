const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const { checkLogin } = require('./backend/database');
const { createLobby, quickPlay, removeLobby, addPlayerToLobby, playerCountInLobby, getPlayersByLobbyID, removePlayerFromLobby } = require('./backend/lobbyHandler')
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
                    addPlayerToLobby(socket.request.session.username, lobby.id)
                    console.log(socket.request.session.username + " added to lobby: " + lobby.id);
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
            let lobbyID = socket.request.session.lobbyID
            socket.join(lobbyID)
            const players = getPlayersByLobbyID(lobbyID)
            socket.emit('join-Lobby', lobbyID)
            io.to(lobbyID).emit('user-update', players)
            io.to(lobbyID).emit('player-Join', req.session.username +" ist der Lobby beigetreten.")
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
                    addPlayerToLobby(socket.request.session.username, lobby.id)
                    console.log(socket.request.session.username + " added to lobby: " + lobby.id);
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
        io.to(req.session.lobbyID).emit('chat-message', req.session.username +": " + msg)
    })
    
    socket.on('leave-Lobby', (data) => {
        let username = req.session.username
        let lobbyID =  req.session.lobbyID
        
        removePlayerFromLobby(username, lobbyID)
        const players = getPlayersByLobbyID(lobbyID)
        io.to(lobbyID).emit('user-update', players)
        io.to(lobbyID).emit('player-Leave', username +" hat die Lobby verlassen.")
        console.log(username + " removed from lobby: " + lobbyID);
        if(playerCountInLobby(lobbyID) == 0) {
             removeLobby(lobbyID)
             console.log("lobby: " + lobbyID + " closed");
        }
        socket.leave(lobbyID)
        req.session.lobbyID = undefined
        req.session.save()
    })
})

server.listen(80, () => console.log("Server is running on Port *:80"));