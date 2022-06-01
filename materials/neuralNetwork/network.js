class NeuralNetwork {
    constructor(weightLayers = [], activationLayers = []) {

        const network = this

        network.weightLayers = weightLayers
        network.activationLayers = activationLayers

        network.ID = networkManager.newID()

        networkManager.networks[network.ID] = network
    }
}

NeuralNetwork.prototype.construct = function(inputCount, outputCount) {

    const network = this

    network.weightLayers.push([])
    network.activationLayers.push([])

    for (let i = 0; i < inputCount; i++) {

        network.weightLayers[0].push([0])

        network.activationLayers[0].push(0)
    }

    for (let layerIndex = 1; layerIndex < networkManager.hiddenLayersCount + 1; layerIndex++) {

        network.weightLayers.push([])
        network.activationLayers.push([])

        for (let i1 = 0; i1 < networkManager.hiddenPerceptronCount; i1++) {

            network.weightLayers[layerIndex].push([])

            const previousLayerOutputCount = network.activationLayers[layerIndex - 1].length

            for (let i2 = 0; i2 < previousLayerOutputCount; i2++) {

                network.weightLayers[layerIndex][i1].push(0)
            }

            network.activationLayers[layerIndex].push(0)
        }
    }

    network.weightLayers.push([])
    network.activationLayers.push([])

    const lastLayerIndex = [network.activationLayers.length - 1],
        previousLayerOutputCount = network.activationLayers[lastLayerIndex - 1].length

    for (let i1 = 0; i1 < outputCount; i1++) {

        network.weightLayers[lastLayerIndex].push([])

        for (let i2 = 0; i2 < previousLayerOutputCount; i2++) {

            network.weightLayers[lastLayerIndex][i1].push(0)
        }

        network.activationLayers[lastLayerIndex].push(0)
    }
}

NeuralNetwork.prototype.clone = function() {

    const network = this

    return new NeuralNetwork(network.weightLayers, network.activationLayers)
}

NeuralNetwork.prototype.forwardPropagate = function(inputs) {

    const network = this

    // First layer using inputs

    for (let i = 0; i < inputs.length; i++) {

        network.activationLayers[0][i] = Math.max(0, inputs[i].value * network.weightLayers[0][i] + networkManager.bias)
    }

    // Following layers using previous perceptron's values

    for (let layerIndex = 1; layerIndex < network.activationLayers.length; layerIndex++) {

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            network.activationLayers[layerIndex][activationsIndex] = 0

            for (let previousLayerActivationsIndex = 0; previousLayerActivationsIndex < network.activationLayers[layerIndex - 1].length; previousLayerActivationsIndex++) {

                network.activationLayers[layerIndex][activationsIndex] += network.activationLayers[layerIndex - 1][previousLayerActivationsIndex] * network.weightLayers[layerIndex][activationsIndex][previousLayerActivationsIndex]
            }

            network.activationLayers[layerIndex][activationsIndex] = Math.max(0, network.activationLayers[layerIndex][activationsIndex] + networkManager.bias)
        }
    }
}

NeuralNetwork.prototype.backPropagate = function(scoredOutputs) {

    const network = this


}

NeuralNetwork.prototype.learn = function() {

    const network = this

    for (let layerIndex = 0; layerIndex < network.weightLayers.length; layerIndex++) {

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            for (let weightIndex = 0; weightIndex < network.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {

                network.weightLayers[layerIndex][activationsIndex][weightIndex] += Math.random() * networkManager.learningRate - Math.random() * networkManager.learningRate
            }
        }
    }
}

NeuralNetwork.prototype.createVisuals = function(inputs, outputs) {

    const network = this

    // Visual parents

    network.visualsParent = document.createElement('div')

    networkManager.visualsParent.appendChild(network.visualsParent)

    network.visualsParent.classList.add('networkParent')

    let descriptionLayers = [],
        descriptionVisualLayers = [
            [],
            []
        ]

    // Input descriptions

    let descriptionLayerVisual = document.createElement('div')
    descriptionLayerVisual.classList.add('descriptionLayer')

    descriptionLayerVisual.classList.add('inputDescriptionLayer')

    network.visualsParent.appendChild(descriptionLayerVisual)
    descriptionLayers.push(descriptionLayerVisual)

    for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {

        const descriptionVisual = document.createElement('p')

        descriptionLayers[0].appendChild(descriptionVisual)
        descriptionVisualLayers[0].push(descriptionVisual)

        descriptionVisual.innerText = inputs[activationsIndex].name
    }

    // Inputs

    network.inputLayerVisuals = []

    network.inputLayer = document.createElement('div')

    network.visualsParent.appendChild(network.inputLayer)

    network.inputLayer.classList.add('inputLayer')

    for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {

        const inputVisual = document.createElement('p'),
            activation = inputs[activationsIndex].value

        network.inputLayer.appendChild(inputVisual)
        network.inputLayerVisuals.push(inputVisual)

        inputVisual.style.color = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor

        inputVisual.innerText = activation.toFixed(2)
    }

    // Perceptrons and layers

    network.perceptronLayers = []
    network.perceptronVisualLayers = []

    for (let layerIndex = 0; layerIndex < network.activationLayers.length; layerIndex++) {

        network.perceptronVisualLayers.push([])

        const perceptronLayerVisual = document.createElement('div')

        network.visualsParent.appendChild(perceptronLayerVisual)
        network.perceptronLayers.push(perceptronLayerVisual)

        perceptronLayerVisual.classList.add('perceptronLayer')

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            const perceptronVisual = document.createElement('div'),
                activation = network.activationLayers[layerIndex][activationsIndex]

            perceptronLayerVisual.appendChild(perceptronVisual)
            network.perceptronVisualLayers[layerIndex].push(perceptronVisual)

            perceptronVisual.style.borderColor = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor

            perceptronVisual.innerText = activation.toFixed(2)
        }
    }

    // Output descriptions

    descriptionLayerVisual = document.createElement('div')
    descriptionLayerVisual.classList.add('descriptionLayer')

    network.visualsParent.appendChild(descriptionLayerVisual)
    descriptionLayers.push(descriptionLayerVisual)

    for (let activationsIndex = 0; activationsIndex < network.activationLayers[network.activationLayers.length - 1].length; activationsIndex++) {

        const descriptionVisual = document.createElement('p')

        descriptionLayers[1].appendChild(descriptionVisual)
        descriptionVisualLayers[1].push(descriptionVisual)

        descriptionVisual.innerText = outputs[activationsIndex].name
    }

    // Lines

    network.linesParent = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    network.linesParent.classList.add('linesParent')

    network.visualsParent.appendChild(network.linesParent)

    network.lineLayers = [
        []
    ]

    for (let layerIndex = 1; layerIndex < network.activationLayers.length; layerIndex++) {

        network.lineLayers.push([])

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            network.lineLayers[layerIndex].push([])

            for (let weightIndex = 0; weightIndex < network.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {

                const lineVisual = document.createElementNS('http://www.w3.org/2000/svg', 'line')

                network.linesParent.appendChild(lineVisual)
                network.lineLayers[layerIndex][activationsIndex].push(lineVisual)

                lineVisual.style.stroke = network.weightLayers[layerIndex][activationsIndex][weightIndex] <= 0 ? networkManager.negativeColor : networkManager.activationColor

                const perceptron1VisualRect = network.perceptronVisualLayers[layerIndex - 1][weightIndex].getBoundingClientRect(),
                    perceptron2VisualRect = network.perceptronVisualLayers[layerIndex][activationsIndex].getBoundingClientRect(),
                    visualsParentRect = network.visualsParent.getBoundingClientRect()

                lineVisual.setAttribute('x1', Math.floor(perceptron1VisualRect.left + perceptron1VisualRect.width / 2 - visualsParentRect.left))
                lineVisual.setAttribute('y1', Math.floor(perceptron1VisualRect.top + perceptron1VisualRect.height / 2 - visualsParentRect.top))
                lineVisual.setAttribute('x2', Math.floor(perceptron2VisualRect.left + perceptron2VisualRect.width / 2 - visualsParentRect.left))
                lineVisual.setAttribute('y2', Math.floor(perceptron2VisualRect.top + perceptron2VisualRect.height / 2 - visualsParentRect.top))
            }
        }
    }
}

NeuralNetwork.prototype.updateVisuals = function(inputs) {

    const network = this

    // Inputs

    for (let activationsIndex = 0; activationsIndex < network.activationLayers[0].length; activationsIndex++) {

        const inputVisual = network.inputLayerVisuals[activationsIndex],
            activation = inputs[activationsIndex].value

        inputVisual.style.color = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor

        inputVisual.innerText = activation.toFixed(2)
    }

    // Perceptrons and layers

    for (let layerIndex = 0; layerIndex < network.activationLayers.length; layerIndex++) {

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            const perceptronVisual = network.perceptronVisualLayers[layerIndex][activationsIndex],
                activation = network.activationLayers[layerIndex][activationsIndex]

            perceptronVisual.style.borderColor = activation <= 0 ? networkManager.negativeColor : networkManager.activationColor

            perceptronVisual.innerText = activation.toFixed(2)
        }
    }

    // Lines

    for (let layerIndex = 1; layerIndex < network.activationLayers.length; layerIndex++) {

        for (let activationsIndex = 0; activationsIndex < network.activationLayers[layerIndex].length; activationsIndex++) {

            for (let weightIndex = 0; weightIndex < network.weightLayers[layerIndex][activationsIndex].length; weightIndex++) {

                const lineVisual = network.lineLayers[layerIndex][activationsIndex][weightIndex]
                lineVisual.setAttribute('text', network.weightLayers[layerIndex][activationsIndex][weightIndex])
                lineVisual.style.stroke = network.weightLayers[layerIndex][activationsIndex][weightIndex] <= 0 ? networkManager.negativeColor : networkManager.activationColor
            }
        }
    }
}