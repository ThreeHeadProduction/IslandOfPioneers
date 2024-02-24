let allLobbys = []

function createLobby() {
    let lobby = {id:''}
    for(let i = 0; i < 5 ; i++) {
        lobby.id += Math.round((Math.random()*9))
    }
    /* Erstellt neuen Lobbycode rekursiv falls einer schon existiert 
       Eventuell mit array.find() ersetzen */
    allLobbys.forEach(element => {
        if(element.id===lobby.id) {
            return this.createLobby()
        }
    });
    allLobbys.push(lobby)
    return lobby
}

function findRandomLobby() {
    return allLobbys[Math.round(Math.random()*(allLobbys.length-1))]
}



module.exports = {
    quickPlay() {
        if (allLobbys.length==0) {
            /* Gibt neue Lobby wenn keine existiert zurück*/
            return createLobby()
        }
        return findRandomLobby()
    },
    countLobbys() {
        return allLobbys.length
    },
    createLobby: createLobby
}


