class Env {
    constructor() {

        const env = this

        env.games = {}
        env.IDIndex = 0
        env.width = 1000
        env.height = 600
        env.lastReset = 0

        env.gapHeight = 130
        env.floorHeight = 35
        env.birdSpawnLeft = env.width * 0.3

        env.tick = 0
        env.roundTick = 0
        env.generation = 1
        env.birds = 0
        env.topScore = 0
        env.currentScore = 0
        env.gamesAmount = 1
        env.speed = 10

        env.stats = []

        env.inputs = [
            { name: 'Bird Y' },
            { name: 'Bird velocity' },
            { name: 'Gap Y' },
            { name: 'Gap X' },
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

    const allBirds = []
    const aliveBirds = []

    //

    for (const gameID in env.games) {

        const game = env.games[gameID]

        if (this.roundTick % 150 == 0) {

            const pipeTop = new PipeTop(game.ID, Object.keys(game.players)[0])

            new PipeBottom(game.ID, Object.keys(game.players)[0], pipeTop)
        }

        let pipePassed

        const pipeTopsPastBird = []

        for (const ID in game.objects.pipeTop) {

            const pipe = game.objects.pipeTop[ID]

            if (pipe.pos.left + pipe.width * 1.2 <= env.birdSpawnLeft) {

                if (!pipe.pastBird) {

                    pipe.pastBird = true
                    pipePassed = true
                }
            } else pipeTopsPastBird.push(pipe)

            pipe.move(pipe.pos.left - 2, pipe.pos.top)

            if (pipe.pos.left + pipe.width <= 0) pipe.delete()
        }

        const pipeBottomsPastBird = []

        for (const ID in game.objects.pipeBottom) {

            const pipe = game.objects.pipeBottom[ID]

            if (pipe.pos.left + pipe.width * 1.2 <= env.birdSpawnLeft) pipe.pastBird = true

            else pipeBottomsPastBird.push(pipe)

            pipe.move(pipe.pos.left - 2, pipe.pos.top)

            if (pipe.pos.left + pipe.width <= 0) pipe.delete()
        }

        const closestTopPipe = pipeTopsPastBird.sort(function(a, b) {

            return a.left - b.left
        })[0]

        const closestBottomPipe = pipeBottomsPastBird.sort(function(a, b) {

            return a.left - b.left
        })[0]

        const gapCenterY = (closestTopPipe.pos.bottom) + this.gapHeight / 2

        for (const ID in game.objects.bird) {

            const bird = game.objects.bird[ID]

            allBirds.push(bird)

            if (bird.network.visualsParent) bird.network.visualsParent.classList.add('networkParentHide')

            if (bird.dead) continue

            bird.lastJump -= 1

            bird.applyGravity()

            bird.inputs = [
                { name: 'Bird Y', value: bird.pos.top - bird.height / 2 },
                { name: 'Bird velocity', value: bird.velocity },
                { name: 'Gap Y', value: gapCenterY },
                { name: 'Gap X', value: closestTopPipe.pos.right },
            ]

            bird.outputs = [
                { name: 'Flap', operation: () => bird.jump() },
            ]

            bird.network.forwardPropagate(bird.inputs)

            /* if (!bird.network.visualsParent) bird.network.createVisuals(bird.inputs, bird.outputs)
            bird.network.updateVisuals(bird.inputs) */

            // Find last layer

            const lastLayerActivations = bird.network.activationLayers[bird.network.activationLayers.length - 1]

            for (let index = 0; index < lastLayerActivations.length; index++) {

                const activation = lastLayerActivations[index]

                if (activation <= 0) continue

                bird.outputs[index].operation()
            }
            /* 
            // Sort perceptrons by activation and get the largest one

            const largestActivation = [...lastLayerActivations].sort((a, b) => a - b)[lastLayerActivations.length - 1],
                largestActivationIndex = lastLayerActivations.indexOf(largestActivation)

            if (largestActivation > 0)
                bird.outputs[largestActivationIndex].operation()
             */

            bird.move(bird.pos.left, Math.max(bird.pos.top + bird.velocity, 0))

            // If the bird is touching the floor

            if (bird.pos.top + bird.height >= env.height - this.floorHeight) {

                bird.kill()
                continue
            }

            if (bird.pos.isInside(closestTopPipe.pos) ||
                bird.pos.isInside(closestBottomPipe.pos)) {

                bird.kill()
                continue
            }

            if (bird.velocity < 0) bird.imageID = 'birdUp'

            else bird.imageID = 'birdDown'

            if (pipePassed) bird.score += 1
            bird.fitness += 1

            aliveBirds.push(bird)
        }

        game.visualize()
    }

    env.birds = aliveBirds.length

    //

    const fittestUnit = env.findFittestUnit(allBirds)

    if (!fittestUnit.network.visualsParent) fittestUnit.network.createVisuals(fittestUnit.inputs, fittestUnit.outputs)
    fittestUnit.network.updateVisuals(fittestUnit.inputs)
    fittestUnit.network.visualsParent.classList.remove('networkParentHide')

    if (fittestUnit.score > env.topScore) env.topScore = fittestUnit.score
    env.currentScore = fittestUnit.score

    //

    if (!aliveBirds.length) {

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