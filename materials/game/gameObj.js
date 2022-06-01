class GameObject {
    constructor(type, gameID, ownerID, left, top, width, height) {

        const gameObj = this

        gameObj.type = type
        gameObj.gameID = gameID
        gameObj.ownerID = ownerID

        gameObj.pos = new Pos(left, top, width, height)

        gameObj.width = width
        gameObj.height = height

        gameObj.ID = env.newID()

        const game = env.games[gameObj.gameID]

        if (!game.objects[type]) game.objects[type] = {}
        game.objects[type][gameObj.ID] = gameObj
    }
}

GameObject.prototype.draw = function() {

    const gameObj = this

    env.cm.drawImage(document.getElementById(gameObj.type), gameObj.pos.left, gameObj.pos.top, gameObj.width, gameObj.height)
}

GameObject.prototype.delete = function() {

    const gameObj = this

    if (gameObj.network) {

        if (gameObj.network.visualsParent) gameObj.network.visualsParent.remove()

        delete networkManager.networks[gameObj.network.ID]
    }

    delete env.games[gameObj.gameID].objects[gameObj.type][gameObj.ID]
}

GameObject.prototype.move = function(left, top) {

    const gameObj = this

    // Check if the new pos is out of map bounds, stopping if it is

    if (left < 0 || left + gameObj.width >= env.width || top < 0 || top + gameObj.height >= env.height) return

    // Otherwise assign the new left and top to the gameObj's pos

    gameObj.pos.left = left
    gameObj.pos.right = left + gameObj.width
    gameObj.pos.top = top
    gameObj.pos.bottom = top + gameObj.height
}