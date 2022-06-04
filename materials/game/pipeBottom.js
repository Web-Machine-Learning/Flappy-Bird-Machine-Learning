class PipeBottom extends GameObject {
    constructor(gameID, ownerID) {

        const height = 305
        const top = env.height - height

        super('pipeBottom', gameID, ownerID, env.width, top, 60, height)


    }
}