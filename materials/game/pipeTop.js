class PipeTop extends GameObject {
    constructor(gameID, ownerID) {

        const height = 500
        const top = 0 - Math.max(Math.min(Math.random() * height, height * 0.8), env.height * 0.2)

        super('pipeTop', gameID, ownerID, env.width, top, 60, height)


    }
}