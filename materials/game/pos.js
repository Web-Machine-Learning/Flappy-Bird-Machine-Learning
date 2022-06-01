class Pos {
    constructor(left, top, width, height) {

        const pos = this

        pos.left = left
        pos.top = top
        pos.right = left + width
        pos.bottom = top + height
    }
}

/**
 * Finds the distance between two positions
 * @param otherPos The other pos to find distance from
 * @returns Distance between the positions
 */
Pos.prototype.getDistance = function(otherPos) {

    const pos = this

    // Configure positions

    const leftDifference = pos.left - otherPos.left
    const topDifference = pos.top - otherPos.top

    // Find range using pythagorus and inform it

    const range = Math.sqrt(Math.pow(leftDifference, 2) + Math.pow(topDifference, 2))
    return range
}

/**
 * Checks is a position is inside another
 * @param otherPos The other pos
 * @returns A boolean of if the positions are inside each other
 */
Pos.prototype.isInside = function(otherPos) {

    const pos = this

    // Check is pos is inside otherPos

    if (pos.bottom >= otherPos.top &&
        pos.top <= otherPos.bottom &&
        pos.right >= otherPos.left &&
        pos.left <= otherPos.right) {

        // Inform true

        return true
    }
}