class PipeTop extends GameObject {
    constructor(gameID, ownerID) {

        const height = 500
        const top = 0 - Math.max(Math.min(Math.random() * env.height, env.height * 0.65), env.height * 0.45)

        super('pipeTop', gameID, ownerID, env.width, top, 60, height)


    }
}