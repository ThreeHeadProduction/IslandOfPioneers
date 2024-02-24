window.onload = function () {
    const form = document.getElementById('chatControls')
    const input = document.getElementById('chatInput')
    const id = document.getElementById('lobbyID')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if(input.value.trim() != "") {
            addMessage(input.value)
            input.value = ""
        }
    })

    let idText = "#"
    for(let i =0;i<5;i++) {
        idText += Math.round((Math.random()*9))
    }
    id.innerText = idText
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