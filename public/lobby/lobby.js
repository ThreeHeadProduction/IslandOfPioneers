var socket = io()

window.onload = function () {
    const form = document.getElementById('chatControls')
    const input = document.getElementById('chatInput')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if(input.value.trim() != "") {
            addMessage(input.value)
            input.value = ""
        }
    })

}

function copyToClipboard() {
    const id = document.getElementById('lobbyID')
    navigator.clipboard.writeText(id.innerText.split('#')[1])
}


function addMessage(msg) {
    const messages = document.getElementById('messages');
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
}

socket.on('join-Lobby', (data) => {
    const lobbyID = document.getElementById('lobbyID')
    lobbyID.innerText = '#'+data
})