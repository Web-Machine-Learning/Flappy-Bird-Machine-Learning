class Env {
    constructor() {

        const env = this

        env.games = {}
        env.IDIndex = 0
        env.width = 900
        env.height = 700
        env.lastReset = 0

        env.tick = 0
        env.roundTick = 0
        env.generation = 1
        env.topFitness = 0
        env.currentFitness = 0
        env.gamesAmount = 1
        env.speed = 1

        env.stats = [
            'tick',
            'roundTick',
            'generation',
            'gamesAmount',
            'topFitness',
            'currentFitness',
            'speed'
        ]

        env.inputs = [
            { name: 'X unit pos', value: 0 },
            { name: 'Y unit pos', value: 0 },
        ]

        env.outputs = [
            { name: 'Move left' },
            { name: 'Move right' },
            { name: 'Move up' },
            { name: 'Move down' },
        ]
    }
}

const env = new Env()

Env.prototype.init = function() {

    // Get the existing canvas environment

    env.canvas = document.getElementsByClassName('env')[0]

    // Style canvas

    env.canvas.width = env.width
    env.canvas.height = env.height

    // Create canvas manager by configuring canvas context

    env.cm = env.canvas.getContext('2d')

    // Turn off anti-aliasing

    env.cm.imageSmoothingEnabled = false

    env.initGames()
}

Env.prototype.initGames = function() {

    //

    for (let i = 0; i < env.gamesAmount; i++) {

        const game = new Game()
        game.init(env.inputs, env.outputs)
    }
}

Env.prototype.newID = function() {

    return env.IDIndex++
}

Env.prototype.run = function() {

    env.tick += 1
    env.roundTick += 1

    for (const statType of env.stats) {

        document.getElementById(statType).innerText = env[statType]
    }

    // Store the current transformation matrix

    env.cm.save()

    // Use the identity matrix while clearing the canvas

    env.cm.setTransform(1, 0, 0, 1, 0, 0)
    env.cm.clearRect(0, 0, env.width, env.height)

    //

    // Restore the transform

    env.cm.restore()

    //

    /* Object.values(env.games)[0].visualize() */

    // Record units

    const units = []

    //

    for (const gameID in env.games) {

        const game = env.games[gameID]

        for (const ID in game.objects.example) {

            const gameObj = game.objects.example[ID]

            gameObj.inputs = [
                { name: 'X unit pos', value: gameObj.pos.left - gameObj.width / 2 },
                { name: 'Y unit pos', value: gameObj.pos.top - gameObj.height / 2 },
            ]

            gameObj.outputs = [
                { name: 'Move left', operation: () => gameObj.move(gameObj.pos.left - 1, gameObj.pos.top) },
                { name: 'Move right', operation: () => gameObj.move(gameObj.pos.left + 1, gameObj.pos.top) },
                { name: 'Move up', operation: () => gameObj.move(gameObj.pos.left, gameObj.pos.top - 1) },
                { name: 'Move down', operation: () => gameObj.move(gameObj.pos.left, gameObj.pos.top + 1) },
            ]

            gameObj.network.forwardPropagate(gameObj.inputs)

            /* if (!gameObj.network.visualsParent) gameObj.network.createVisuals(gameObj.inputs, gameObj.outputs)
            gameObj.network.updateVisuals(gameObj.inputs) */

            if (gameObj.network.visualsParent) gameObj.network.visualsParent.classList.add('networkParentHide')

            // Find last layer

            const lastLayerActivations = gameObj.network.activationLayers[gameObj.network.activationLayers.length - 1],
                /* 
                            for (const perceptron of lastLayerPerceptrons) {

                                if (perceptron.activation <= 0) continue

                                gameObj.outputs[perceptron.name].operation()
                            }
                 */
                // Sort perceptrons by activation and get the largest one

                largestActivation = [...lastLayerActivations].sort((a, b) => a - b)[lastLayerActivations.length - 1],
                largestActivationIndex = lastLayerActivations.indexOf(largestActivation)

            if (largestActivation > 0) {

                gameObj.outputs[largestActivationIndex].operation()
            }

            gameObj.generateFitness()

            units.push(gameObj)
        }

        game.visualize()
    }

    //

    const fittestUnit = env.findFittestUnit(units)

    if (!fittestUnit.network.visualsParent) fittestUnit.network.createVisuals(fittestUnit.inputs, fittestUnit.outputs)
    fittestUnit.network.updateVisuals(fittestUnit.inputs)
    fittestUnit.network.visualsParent.classList.remove('networkParentHide')

    if (fittestUnit.fitness > env.topFitness) env.topFitness = fittestUnit.fitness
    env.currentFitness = fittestUnit.fitness

    //

    if (env.tick - env.lastReset > env.width + env.height) {

        env.reset(fittestUnit)
    }
}

Env.prototype.findFittestUnit = function(units) {

    return fitestUnit = units.sort((a, b) => a.fitness - b.fitness)[units.length - 1]
}

Env.prototype.reset = function(fittestUnit) {

    env.lastReset = env.tick
    env.roundTick = 0
    env.generation += 1

    const weightLayers = fittestUnit.weightLayers,
        activationLayers = fittestUnit.activationLayers

    fittestUnit.delete()

    for (const gameID in env.games) {

        const game = env.games[gameID]

        game.reset()
        game.init(env.inputs, env.outputs, weightLayers, activationLayers)
    }
}