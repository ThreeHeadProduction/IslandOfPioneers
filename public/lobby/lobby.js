var socket = io()

window.onload = function () {
    const form = document.getElementById('chatControls')
    const input = document.getElementById('chatInput')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (input.value.trim() != "") {
            socket.emit('chat-message', input.value)
            input.value = ""
        }
    })

}

function copyToClipboard() {
    const id = document.getElementById('lobbyID')
    navigator.clipboard.writeText(id.innerText.split('#')[1])
}


function addMessage(msg, color) {
    const messages = document.getElementById('messages');
    const item = document.createElement('li');
    item.textContent = msg;
    item.style.color = color
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
}

function addUserToPlayerList(username) {
    const playerDiv = document.createElement('div')
    const playerName = document.createElement('p')
    playerDiv.className = "player"
    playerName.className = "playerName"

    playerName.innerText = username

    playerDiv.appendChild(playerName)
    document.getElementById('playerList').appendChild(playerDiv)
}

function leaveLobby() {
    socket.emit('leave-Lobby', "test")
    window.location.href = '/main'
}

socket.on('chat-message', (msg) => {
    addMessage(msg, 'black')
})

socket.on('player-Leave', (msg) => {
    addMessage(msg, '#F80F0F')
})

socket.on('player-Join', (msg) => {
    addMessage(msg, '#14b50e')
})


socket.on('lobby-Code', (data) => {
    const lobbyID = document.getElementById('lobbyID')
    lobbyID.innerText = '#' + data
})

socket.on('user-update', (players) => {
    document.getElementById('playerList').innerHTML = ""

    players.forEach(player => {
        addUserToPlayerList(player)
    });
})

socket.emit('enter-Lobby', null)