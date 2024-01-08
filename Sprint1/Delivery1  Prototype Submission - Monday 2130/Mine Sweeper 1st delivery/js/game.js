'use strict'

const totalNegsMines = 2
const LIVES = 1

// TODO: Change the visuals to images instead of emojis
const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'

var gBoard
var timerInterval

const gLevel = {
    beginner: { SIZE: 4, MINES: 2 },
    medium: { SIZE: 8, MINES: 14 },
    expert: { SIZE: 12, MINES: 32 }
}

var gCurrLevel = gLevel.beginner
   

const gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: LIVES
}

function updateTimer() {

    const elTimer = document.querySelector(`.timer`)

    timerInterval = setInterval(() => {

        if(gGame.isOn) {
            gGame.secsPassed++
            elTimer.innerHTML = gGame.secsPassed
        }
    }, 1000 * 1)
}

function updateLives() {

    const elLives = document.querySelector(`.lives`)
    elLives.innerHTML = gGame.lives
}

function initCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function changeSmiley(str) { 

    const elSmiley = document.querySelector(`span3`)
    elSmiley.innerHTML = str
}


function toggleFlag(cell) {
    if (!cell.isShown) {
        cell.isMarked = !cell.isMarked
        checkVictory()
    }
}

function checkVictory() {
    var allMinesFlagged = true
    var allOtherCellsShown = true

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]

            if (currCell.isMine) {
                if (!currCell.isMarked) {
                    allMinesFlagged = false
                }
            } else {
                if (!currCell.isShown) {
                    allOtherCellsShown = false
                }
            }
        }
    }

    if (allMinesFlagged && allOtherCellsShown) {
        console.log('You win!')
        changeSmiley('😎')
        gameOver()
    }
}

function expandCell(location) {
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length) {
                const neighborCell = gBoard[i][j]
                if (!neighborCell.isMine && !neighborCell.isShown) {
                    neighborCell.isShown = true
                    gGame.shownCount++
                    // If the neighbor has no neighbors, recursively expand it
                    if (neighborCell.minesAroundCount === 0) {
                        expandCell({ i, j })
                    }
                }
            }
        }
    }
}

function gameOver() {
    gGame.isOn = false
    revealMines()
}

function resetTimer() {

    clearInterval(timerInterval)
    const elTimer = document.querySelector(`.timer`)
    elTimer.innerHTML = ''
}

function resetGame() {
    gGame.secsPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.lives = LIVES
    gGame.isOn = true

    // Reset the board and render
    gBoard = createBoard(gCurrLevel.SIZE, gCurrLevel.SIZE)
    renderBoard(gBoard, '.board-container')

    // Restart the timer
    onInit()
    changeSmiley('😃')
}


function addMines(board, totalMines, clickedCellLocation) {
    var minesPlaced = 0

    while (minesPlaced < totalMines) {
        var randRow = Math.floor(Math.random() * board.length)
        var randCol = Math.floor(Math.random() * board[0].length)
        var currCell = board[randRow][randCol]

        if (!currCell.isMine) {
            currCell.isMine = true
            minesPlaced++
        }
    }
    console.log(minesPlaced)
}

function setMinesNegsCount(board, location) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                continue
            }
            
            var minesCount = countNeighborMines(board, i, j)
            board[i][j].minesAroundCount = minesCount
        }
    }
}

function countNeighborMines(board, row, col) {
    var count = 0
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < board.length &&
                j >= 0 && j < board[0].length && board[i][j].isMine) {
                count++
            }
        }
    }
    return count
}


function revealMines() {

    for (var i = 0; i < gBoard.length; i++) {
        const row = gBoard[i]
      
        for (var j = 0; j < gBoard[i].length; j++) {
            const col = gBoard[j]
            const currCell = gBoard[i][j]

            if(currCell.isMine) {

                currCell.isShown = true
            }
        }
    }
}

function setLevel(lvl) {

    if(lvl === 'beginner') {
        gCurrLevel = gLevel.beginner
    }
    if(lvl === 'medium') {
        gCurrLevel = gLevel.medium
    }
    if(lvl === 'expert') {
        gCurrLevel = gLevel.expert
    }
    resetGame()
}