class Player {
    constructor(name, gameID) {

        const player = this

        player.name = name
        player.gameID = gameID

        player.ID = env.newID()

        env.games[player.gameID].players[player.ID] = player
    }
}