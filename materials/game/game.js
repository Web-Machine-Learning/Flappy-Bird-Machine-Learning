class Game {
    constructor() {

        const game = this

        game.ID = env.newID()
        game.players = {}
        game.objects = {}
        game.running = true

        env.games[game.ID] = game
    }
}

Game.prototype.init = function(inputs, outputs, weightLayers, activationLayers) {

    const game = this

    // Create players

    /* new Player('person', game.ID) */

    new GameObject('background', game.ID, Object.keys(game.players)[0], 0, 0, env.width, env.height)

    new GameObject('floor', game.ID, Object.keys(game.players)[0], 0, env.height - env.floorHeight, env.width, env.floorHeight)

    const pipeTop = new PipeTop(game.ID, Object.keys(game.players)[0])

    new PipeBottom(game.ID, Object.keys(game.players)[0], pipeTop)

    // Create x number of units

    for (let i = 0; i < 100; i++) {

        new Bird(game.ID, Object.keys(game.players)[0], inputs, outputs, weightLayers, activationLayers)
    }
}

Game.prototype.reset = function() {

    const game = this

    game.players = {}

    for (const type in game.objects) {

        for (const ID in game.objects[type]) {

            const gameObj = game.objects[type][ID]

            gameObj.delete()
        }
    }

    game.running = true
}

Game.prototype.visualize = function() {

    const game = this

    for (const type in game.objects) {

        for (const ID in game.objects[type]) {

            const gameObj = game.objects[type][ID]

            gameObj.draw()
        }
    }
}