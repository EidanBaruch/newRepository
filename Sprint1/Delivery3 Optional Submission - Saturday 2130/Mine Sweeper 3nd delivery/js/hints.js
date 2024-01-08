'use strict'


function onHintButtonClick() {
    const elHintButton = document.querySelector('.hint-button')

    // if hint button was clicked
    if (elHintButton) {

        elHintButton.classList.toggle('hint-button-clicked')

    } else {
        console.log("Hint button not found in the DOM.")
        return
    }

    // toggle
    gGame.hintClicked = !gGame.hintClicked
}

function useHint(cell, cellLoc) {
    if (gGame.hints > 0 && gGame.isOn && gGame.hintClicked) {
        gGame.hints--
        updateHints()
        showHint(cell, cellLoc)
    } else if(gGame.hints <= 0) console.log('Insufficient hints')
}


function showHint(cell, cellLoc) {

    if (!cell.isShown && !cell.isMarked) {

        cell.isShown = true

        revealNegs(cell, cellLoc)
        renderBoard(gBoard, '.board-container')
        hideHint(cell, 3)

    }
}

function hideHint(cell, delay) {

        setTimeout(() => {

        cell.isShown = false
        renderBoard(gBoard, '.board-container')
    }, 1000 * delay)
}

function revealNegs(cell, cellLoc) {

    for (var row = cellLoc.i - 1; row <= cellLoc.i + 1; row++) {
        for (var col = cellLoc.j - 1; col <= cellLoc.j + 1; col++) {
            if (row >= 0 && row < gCurrLevel.SIZE 
                && col >= 0 && col < gCurrLevel.SIZE) {

                gBoard[row][col].isShown = true

                hideHint(gBoard[row][col], 3)
            }
        }
    }

    hideHint(cell, 3)
    renderBoard(gBoard, '.board-container')
}
