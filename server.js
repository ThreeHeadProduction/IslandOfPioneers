const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    console.log('Connected');

    socket.on('disconnect', () => {
        console.log('Connection lose');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

});


server.listen(3000, () => {
    console.log('listening on *:3000');
});