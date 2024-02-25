let allLobbys = []

function createLobby() {
    let lobby = { id: '', players: [] }
    for (let i = 0; i < 5; i++) {
        lobby.id += Math.round((Math.random() * 9))
    }
    /* Erstellt neuen Lobbycode rekursiv falls einer schon existiert 
       Eventuell mit array.find() ersetzen */
    allLobbys.forEach(element => {
        if (element.id === lobby.id) {
            return this.createLobby()
        }
    });
    allLobbys.push(lobby)
    console.log("lobby: " + lobby.id + " created");
    return lobby
}

function findRandomLobby() {
    return allLobbys[Math.round(Math.random() * (allLobbys.length - 1))]
}

function getLobbyByLobbyID(id) {
    let lobby
    for (let i = 0; i < allLobbys.length; i++) {
        if (allLobbys[i].id === id) {
            lobby = allLobbys[i]
            break
        }
    }
    return lobby
}


module.exports = {
    createLobby: createLobby,
    quickPlay() {
        if (allLobbys.length == 0) {
            /* Gibt neue Lobby wenn keine existiert zurück*/
            return createLobby()
        }
        return findRandomLobby()
    },
    lobbyCount() {
        return allLobbys.length
    },
    playerCountInLobby(id) {
        let lobby = getLobbyByLobbyID(id)
        return lobby.players.length
    },
    removeLobby(id) {
        let lobby = getLobbyByLobbyID(id)

        allLobbys.splice(allLobbys.indexOf(lobby), 1)

    },
    addPlayerToLobby(user, id) {
        let lobby = getLobbyByLobbyID(id)
        allLobbys[allLobbys.indexOf(lobby)].players.push(user)
    },
    removePlayerFromLobby(user, id) {
        let lobby = getLobbyByLobbyID(id)
        let players = allLobbys[allLobbys.indexOf(lobby)].players
        
        players.splice(players.indexOf(user) , 1)
        
        allLobbys[allLobbys.indexOf(lobby)].players = players
    },
    getPlayersByLobbyID(id) {
        return getLobbyByLobbyID(id).players
    }
}


