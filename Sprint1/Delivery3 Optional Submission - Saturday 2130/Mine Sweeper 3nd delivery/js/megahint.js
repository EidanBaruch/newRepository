'use strict'

function onMegaHint() {

    if (gGame.score === 0) return console.log('Can\'t use Mega Hint on first move')

    // Toggle after clicking button
    gGame.megaHintActive = !gGame.megaHintActive

    // Toggle - Dom
    const elMegaHintButton = document.querySelector('.mega-hint-button')
    elMegaHintButton.classList.toggle('mega-hint-active', gGame.megaHintActive)


    // Reset the Mega Hint clicks
    megaHintClick1 = undefined
    megaHintClick2 = undefined
}

function useMegaHint(clickedCellLoc) {
    if (!gGame.megaHintActive) return


    if (megaHintClick1 === undefined) {
        megaHintClick1 = { i: clickedCellLoc.i, j: clickedCellLoc.j }
        return
    }

    if (megaHintClick2 === undefined) {
        megaHintClick2 = { i: clickedCellLoc.i, j: clickedCellLoc.j }

        // After both clicks are defined, reveal the area
        revealMegaHintArea()
        return
    }
}

function revealMegaHintArea() {

    gGame.megaHintActive = false
    
    //check both clicks are defIned
    if (megaHintClick1 && megaHintClick2) {
        
        const topLeft = {
            i: Math.min(megaHintClick1.i, megaHintClick2.i),
            j: Math.min(megaHintClick1.j, megaHintClick2.j)
        };
        const bottomRight = {
            i: Math.max(megaHintClick1.i, megaHintClick2.i),
            j: Math.max(megaHintClick1.j, megaHintClick2.j)
        };

        // Iterate over the area and reveal the cells for 2 seconds
        for (var i = topLeft.i; i <= bottomRight.i; i++) {
            for (var j = topLeft.j; j <= bottomRight.j; j++) {
                const cell = gBoard[i][j]
                cell.isShown = true
                
            }
        }

        // Render the updated board - after revealing
        renderBoard(gBoard, '.board-container')

        // Reset the Mega Hint clicks after 2 seconds
        setTimeout(() => {
            megaHintClick1 = undefined
            megaHintClick2 = undefined

            // Hide the revealed cells
            for (var i = topLeft.i; i <= bottomRight.i; i++) {
                for (var j = topLeft.j; j <= bottomRight.j; j++) {
                    const cell = gBoard[i][j]
                    cell.isShown = false
                }
            }

            // Render the updated board - after hiding
            renderBoard(gBoard, '.board-container')
        }, 1000 * 2)
    }

    // Reset Mega Hint Button - Dome
    const elMegaHintButton = document.querySelector('.mega-hint-button')
    elMegaHintButton.classList.remove('mega-hint-active')
}
