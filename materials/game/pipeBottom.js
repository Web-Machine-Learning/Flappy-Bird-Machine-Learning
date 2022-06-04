class PipeBottom extends GameObject {
    constructor(gameID, ownerID, pipeTop) {

        const height = 500
        const top = env.gapHeight + pipeTop.pos.top + pipeTop.height

        super('pipeBottom', gameID, ownerID, env.width, top, 60, height)


    }
}