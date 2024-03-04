const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
})


server.listen(80, () => console.log("Server is running on Port *:80"));