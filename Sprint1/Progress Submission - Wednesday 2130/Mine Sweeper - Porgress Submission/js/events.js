'use strict'


function onInit() {

    resetTimer()
    gBoard = createBoard(gCurrLevel.SIZE, gCurrLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    updateLives()
    updateHints()
    changeSmiley('😃')
}

function onCellRightClicked(ev, currCell) {
    const elClickedCell = ev.target
    const rowIdx = elClickedCell.parentElement ? elClickedCell.parentElement.rowIndex : undefined
    const colIdx = elClickedCell.cellIndex

    // Check if rowIndex is defined
    if (rowIdx !== undefined) {
        const currCell = gBoard[rowIdx][colIdx]

        if (!gGame.isOn || currCell.isShown) return

        toggleFlag(currCell)

        // Dome
        renderBoard(gBoard, '.board-container')
    }
}


function onSafeClick() {

    if(gGame.safeClicks > 0) {

        var randCell = getRandomCellWithoutMine()
        markSafeClick(randCell)

        gGame.safeClicks--
        updateSafeClicks()

    } else console.log('Insufficient safe clicks')
}

function markSafeClick(cell) {

    gBoard[cell.i][cell.j].isSafeClick = true
    renderBoard(gBoard, '.board-container')
    
    setTimeout(() => {
        gBoard[cell.i][cell.j].isSafeClick = false
        renderBoard(gBoard, '.board-container')
    }, 2000)
}

function onCellClicked(ev) {

    const clickedCell = ev.target
    const rowIdx = clickedCell.parentElement.rowIndex
    const colIdx = clickedCell.cellIndex
    const clickedCellLoc = { i: rowIdx, j: colIdx }
    const currCell = gBoard[rowIdx][colIdx]

    // Check if the clicked element is a cell (td)
    if (clickedCell.tagName === 'TD') {

        if (!gGame.isOn) return
        if (currCell.isMarked) return

        // If user clicked a cell while hint button is on
        if (gGame.hintClicked) { 
        
            if(gGame.shownCount === 0 && gGame.hintsUsed === 0) {            

                onFirstClick(clickedCellLoc)
            }


            useHint(currCell, clickedCellLoc)
            gGame.hintsUsed++

            // Dome
            renderBoard(gBoard, '.board-container')
            return
        }

        // Right-click to flag/unflag
        if (ev.type === 'contextmenu') {

            // Stop original browser menu
            ev.preventDefault()

            // different event handler for a right click
            onCellRightClicked(ev, currCell)

            // Dome
            renderBoard(gBoard, '.board-container')
            return
        }


        if (!isNaN(rowIdx) && !isNaN(colIdx)) {
             
            // If first click - generate 
            if(gGame.shownCount === 0 && gGame.hintsUsed === 0) {
                
                onFirstClick(clickedCellLoc)
            }

            gGame.shownCount++

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
                changeSmiley('🤯')

                if (gGame.lives === 0) {

                    gameOver()
                    console.log('You lose')
                }
            }


            if (currCell.minesAroundCount > 0) {

                gGame.shownCount++

            } else if(!currCell.isMine){

                expandCell(clickedCellLoc)
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


function relocateMine(clickedCellLoc) {
    const newMineLoc = getRandomCellWithoutMine(clickedCellLoc)

    // Move the mine from the clicked cell to the new location
    gBoard[clickedCellLoc.i][clickedCellLoc.j].isMine = false
    gBoard[newMineLoc.i][newMineLoc.j].isMine = true
}

function getRandomCellWithoutMine() {
    var newMineLoc

    // Generate new locations until hits an empty cell
    while (true) {
        newMineLoc = {
            i: Math.floor(Math.random() * gCurrLevel.SIZE),
            j: Math.floor(Math.random() * gCurrLevel.SIZE)
        }

        if (!gBoard[newMineLoc.i][newMineLoc.j].isMine) {
            break
        }
    }

    return newMineLoc
}
