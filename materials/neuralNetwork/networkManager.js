class NetworkManager {
    constructor() {

        const networkManager = this

        networkManager.networks = {}
        networkManager.IDIndex = 0
        networkManager.activationColor = 'rgb(0, 137, 236)'
        networkManager.negativeColor = 'rgb(241, 0, 19)'

        //

        networkManager.learningRate = 0.1
        networkManager.bias = 0

        // Network structure settings

        networkManager.hiddenLayersCount = 4
        networkManager.hiddenPerceptronCount = 5
    }
}

const networkManager = new NetworkManager()


NetworkManager.prototype.newID = function() {

    return networkManager.IDIndex++
}

NetworkManager.prototype.initVisuals = function() {

    networkManager.visualsParent = document.getElementsByClassName('networkManagerParent')[0]

    document.getElementById('colorGuideActivation').style.background = networkManager.activationColor
    document.getElementById('colorGuideNegative').style.background = networkManager.negativeColor
}

networkManager.initVisuals()