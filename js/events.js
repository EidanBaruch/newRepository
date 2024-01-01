'use strict'


function onInit() {

    resetTimer()
    gBoard = createBoard(gCurrLevel.SIZE, gCurrLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    updateLives()
}

function onCellRightClicked(ev, cell) {
    const rowIdx = cell.parentElement.rowIndex
    const colIdx = cell.cellIndex
    const currCell = gBoard[rowIdx][colIdx]

    if (!gGame.isOn || currCell.isShown) return
    
    ev.preventDefault()
    toggleFlag(currCell)

    // Dome
    renderBoard(gBoard, '.board-container')
}

function onCellClicked(ev) {

    const clickedCell = ev.target
    const rowIdx = clickedCell.parentElement.rowIndex
    const colIdx = clickedCell.cellIndex
    const currCell = gBoard[rowIdx][colIdx]

    // Check if the clicked element is a cell (td)
    if (clickedCell.tagName === 'TD') {

        if (!gGame.isOn) return
        if (currCell.isMarked) return

        // Right-click to flag/unflag

        if (ev.type === 'contextmenu') {

            // Stop original browser menu
            ev.preventDefault()

            onCellRightClicked(ev, currCell)
            //toggleFlag(currCell)

            // Dome
            renderBoard(gBoard, '.board-container')
            return
        }


        if (!isNaN(rowIdx) && !isNaN(colIdx)) {
            
            const clickedCellLocation = { i: rowIdx, j: colIdx }
             
            // If first click - generate 
            if(gGame.shownCount === 0) onFirstClick(clickedCellLocation)

            // Show the clicked cell
            gBoard[rowIdx][colIdx].isShown = true

            // Change styling
            clickedCell.classList.add('clicked-cell')

            // If press mine - decrease lives
            if (currCell.isMine) {
                // Change styling
                clickedCell.classList.add('clicked-mine')

                gGame.lives--
                updateLives()


                if (gGame.lives === 0) {

                    changeSmiley('🤯')
                    gameOver()
                    console.log('You lose')
                }
            }

            // If cell has no neighbors
            if (currCell.minesAroundCount > 0) {

                gGame.shownCount++

            } else if(!currCell.isMine){

                expandCell(clickedCellLocation)
            }

            // Dome
            renderBoard(gBoard, '.board-container')
        }

        checkVictory()
    }
}

function onFirstClick(location) {

    // Arranging the board after the first click
    addMines(gBoard, gCurrLevel.MINES, location)
    setMinesNegsCount(gBoard, location)

    updateTimer()

    // if first click was a mine, change that
    if(gBoard[location.i][location.j].isMine) {
        gBoard[location.i][location.j].isMine = false
    }
}
