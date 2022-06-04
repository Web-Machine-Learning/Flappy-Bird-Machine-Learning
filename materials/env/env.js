class Env {
    constructor() {

        const env = this

        env.games = {}
        env.IDIndex = 0
        env.width = 900
        env.height = 600
        env.lastReset = 0

        env.gapHeight = 60
        env.floorHeight = 35

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
            { name: 'X unit pos' },
            { name: 'Y gap pos' },
            { name: 'Velocity' },
        ]

        env.outputs = [
            { name: 'Flap' },
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

    // Record units

    const units = []

    //

    for (const gameID in env.games) {

        const game = env.games[gameID]

        for (const ID in game.objects.pipeTop) {

            const pipe = game.objects.pipeTop[ID]

            pipe.move(pipe.pos.left - 1, pipe.pos.top)
        }

        for (const ID in game.objects.pipeBottom) {

            const pipe = game.objects.pipeBottom[ID]

            pipe.move(pipe.pos.left - 1, pipe.pos.top)
        }

        const gap = {
            top: 1,
            left: 1,
        }

        for (const ID in game.objects.bird) {

            const bird = game.objects.bird[ID]

            if (bird.network.visualsParent) bird.network.visualsParent.classList.add('networkParentHide')

            if (bird.dead) continue

            bird.lastJump -= 1

            bird.applyGravity()

            bird.inputs = [
                { name: 'X unit pos', value: bird.pos.left - bird.width / 2 },
                { name: 'Y gap pos', value: gap.top },
                { name: 'Velocity', value: bird.velocity },
            ]

            bird.outputs = [
                { name: 'Flap', operation: () => bird.move(bird.pos.left - 1, bird.pos.top) },
            ]

            bird.network.forwardPropagate(bird.inputs)

            /* if (!bird.network.visualsParent) bird.network.createVisuals(bird.inputs, bird.outputs)
            bird.network.updateVisuals(bird.inputs) */

            // Find last layer

            const lastLayerActivations = bird.network.activationLayers[bird.network.activationLayers.length - 1],
                /* 
                            for (const perceptron of lastLayerPerceptrons) {

                                if (perceptron.activation <= 0) continue

                                bird.outputs[perceptron.name].operation()
                            }
                 */
                // Sort perceptrons by activation and get the largest one

                largestActivation = [...lastLayerActivations].sort((a, b) => a - b)[lastLayerActivations.length - 1],
                largestActivationIndex = lastLayerActivations.indexOf(largestActivation)

            if (largestActivation > 0) {

                bird.outputs[largestActivationIndex].operation()
            }

            bird.fitness += 1

            bird.move(bird.pos.left, Math.min(Math.max(bird.pos.top + bird.velocity, bird.height + this.floorHeight), 0))

            units.push(bird)
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