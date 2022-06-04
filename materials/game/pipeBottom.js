class PipeBottom extends GameObject {
    constructor(gameID, ownerID) {

        const height = 244
        const top = env.height - height

        super('pipeBottom', gameID, ownerID, env.width, top, 48, 244)


    }
}