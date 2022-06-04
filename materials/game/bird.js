class Bird extends GameObject {
    constructor(gameID, ownerID, inputs, outputs, weightLayers, activationLayers) {

        const top = env.height * Math.min(Math.max(Math.random(), 0.1), 0.3)

        super('bird', gameID, ownerID, env.birdSpawnLeft, top, 59.5, 42)

        this.jumpDelay = 30
        this.lastJump = this.jumpDelay
        this.jumpVelocity = 6

        this.velocity = 0
        this.score = 0
        this.fitness = 0

        if (weightLayers && activationLayers) {

            this.network = new NeuralNetwork(weightLayers, activationLayers)

        } else {

            this.network = new NeuralNetwork()
            this.network.construct(inputs.length, outputs.length)
        }

        this.network.learn()
    }
}

Bird.prototype.jump = function() {

    if (this.lastJump > 0) return

    this.velocity = Math.min(this.velocity, 0) - this.jumpVelocity

    this.lastJump = this.jumpDelay
}

Bird.prototype.applyGravity = function() {

    this.velocity += 0.3
}

Bird.prototype.kill = function() {

    this.dead = true
    delete this.imageID
}