const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const { checkLogin } = require('./backend/database');
const { checkRegister } = require('./backend/database');
const session = require("express-session");
const { createLobby, quickPlay, removeLobby, addPlayerToLobby, playerCountInLobby, getPlayersByLobbyID, removePlayerFromLobby, getLobbyByLobbyID } = require('./backend/lobbyHandler')
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

app.get('/', (req, res)=> {
    if(req.session.loggedIn == true) {
        res.redirect('/main')
    } else {
        res.sendFile(__dirname+'/views/login.html')
    }
})

app.get('/register', (req, res)=> {
    if(req.session.loggedIn == true) {
        res.redirect('/main')
    } else {
        res.sendFile(__dirname+'/views/register.html')
    }
})

app.get('/main', (req, res)=> {
    if(req.session.loggedIn == true) {
        res.sendFile(__dirname+ '/views/mainMenu.html')
    } else {
        res.redirect('/')
    }
})

app.get('/main/searchLobby', (req, res) => {

    if (req.session.loggedIn == true) res.sendFile(__dirname + '/views/mainMenu.html');
    else res.redirect('/');
})


app.get('/main/lobby', (req, res) => {
    if (req.session.loggedIn == true && req.session.lobbyID)  res.redirect('/main/lobby/' + req.session.lobbyID)
    else res.redirect('/');
})

app.get('/main/lobby/:lobby', (req, res) => {
    if (req.session.loggedIn == true && req.session.lobbyID)  res.sendFile(__dirname + '/views/lobby.html');
    else res.redirect('/');
})


io.on('connection', (socket) => {

    const req = socket.request;
    socket.on('login', (data) => {
        checkLogin(data.username, data.password)
        .then(result => {
            req.session.loggedIn = result.successful
            if(result.successful) {
                req.session.username = result.data.username
            }
            req.session.save()
            if(req.session.loggedIn == true) {
                let destination = '/main';
                socket.emit('redirect', destination);
            }
        })
       
    })


    socket.on('register',(data)=> {
        console.log(data);
        checkRegister(data.email, data.username, data.password)
        .then(result => {
                socket.emit('redirect', '/main');
        })
        
    })
    

    socket.on('logout', (data) => {
        req.session.destroy();
        socket.emit('redirect', ('/'));
    });

    socket.on('chat-message', (msg) => {
        io.to(req.session.lobbyID).emit('chat-message', req.session.username + ": " + msg)
    })

    socket.on('lobby-player-leave', (data) => {
        let username = req.session.username
        let lobbyID = req.session.lobbyID
        if (lobbyID) {
            removePlayerFromLobby(username, lobbyID)
            const players = getPlayersByLobbyID(lobbyID)
            io.to(lobbyID).emit('lobby-playerlist-update', players)
            io.to(lobbyID).emit('chat-player-leave', username + " hat die Lobby verlassen.")
            console.log(username + " removed from lobby: " + lobbyID);
            if (playerCountInLobby(lobbyID) == 0) {
                removeLobby(lobbyID)
                console.log("lobby: " + lobbyID + " closed");
            }
            socket.leave(lobbyID)
            req.session.lobbyID = undefined
        }
        req.session.save()
    })

    socket.on('create-Lobby', (data) => {
        if (req.session.lobbyID === undefined) {
            const lobby = createLobby()
            addPlayerToLobby(req.session.username, lobby.id)
            console.log(req.session.username + " added to lobby: " + lobby.id);
            req.session.lobbyID = lobby.id
            req.session.save()
        }
        socket.emit('redirect', '/main/lobby/' + req.session.lobbyID)
    })

    socket.on('quick-Play', (data) => {
        const lobby = quickPlay()
        if (req.session.lobbyID === undefined) {
            addPlayerToLobby(req.session.username, lobby.id)
            console.log(req.session.username + " added to lobby: " + lobby.id);
            req.session.lobbyID = lobby.id
            req.session.save()
        }
        socket.emit('redirect', '/main/lobby/' + req.session.lobbyID)

    })

    socket.on('lobby-player-join', (data) => {
        if (req.session.lobbyID) {
            let lobbyID = req.session.lobbyID
            socket.join(lobbyID)
            const players = getPlayersByLobbyID(lobbyID)
            socket.emit('lobby-send-code', lobbyID)
            io.to(lobbyID).emit('lobby-playerlist-update', players)
            io.to(lobbyID).emit('chat-player-join', req.session.username + " ist der Lobby beigetreten.")
        }
    })

        socket.on('lobby-code-join', (lobbyID) => {
        if(req.session.lobbyID===undefined) {
            if(getLobbyByLobbyID(lobbyID)) {
                addPlayerToLobby(req.session.username, lobbyID)
                req.session.lobbyID = lobbyID
                req.session.save()
                socket.emit('redirect', '/main/lobby/' + req.session.lobbyID)
            } else {
                // keine Lobby mit dem Code gefunden
            }
        }
    })
})

server.listen(80, () => {
    console.log("Server is running on Port *:80");
})