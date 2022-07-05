env.init()

const runners = []

class Runner {
    constructor() {

        const runner = this

        runners.shift()

        runner.ID = env.newID()

        runners.push(runner.ID)
    }
}

Runner.prototype.run = function() {

    const runner = this

    /*     
    let i = env.speed

        while (i > 0) {

            setInterval(function() {

                if (!runners.includes(runner.ID)) return

                env.run()

            }, 1000 - env.speed)

            i--
        } 
    */

    setInterval(function() {

        if (!runners.includes(runner.ID)) return

        env.run()

    }, env.speed)
}

changeSpeed()

function changeSpeed() {

    env.speed = env.speed

    const runner = new Runner()
    runner.run()
}

function stopRefresh(event) {

    event.preventDefault()
}