'use strict'

const totalNegsMines = 2
const LIVES = 3
const HINTS = 3
const SAFECLICKS = 3

// Visuals
const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'
const HINT = '💡'

var gBoard
var timerInterval
var gameStateHistory = []
var currGameStateIdx = -1
var megaHintClick1
var megaHintClick2


const gLevel = {
    beginner: { SIZE: 4, MINES: 2 },
    medium: { SIZE: 8, MINES: 14 },
    expert: { SIZE: 12, MINES: 32 }
}

var gCurrLevel = gLevel.beginner



var gGame = {
    isOn: true,
    hintClicked: false,
    manualMode: false,
    megaHintActive: false,
    score: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hintsUsed: 0,
    minesplaced: 0,
    lives: LIVES,
    hints: HINTS,
    safeClicks: SAFECLICKS,
}

function onInit() {

    gGame.score = 0

    resetTimer()
    gBoard = createBoard(gCurrLevel.SIZE, gCurrLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    updateLives()
    updateHints()
    updateScore()
    updateBestScore(gCurrLevel)
    changeSmiley('😃')

    saveGameState()
}

function updateTimer() {
    const elTimer = document.querySelector(`.timer`)

    timerInterval = setInterval(() => {
        if (gGame.isOn) {
            gGame.secsPassed++
            elTimer.innerHTML = gGame.secsPassed
        }
    }, 1000 * 1)
}

function updateLives() {
    const elLives = document.querySelector(`.lives`)
    elLives.innerHTML = gGame.lives
}

function updateScore() {
    const elScore = document.querySelector(`#current-score`)
    elScore.textContent = gGame.score
}

function updateHints() {
    const elHintsLeft = document.querySelector(`.hints-left`)
    elHintsLeft.innerHTML = gGame.hints
}

function updateSafeClicks() {
    const elSafeClickBtn = document.querySelector(`.safe-click-button`)
    elSafeClickBtn.innerHTML = gGame.safeClicks
}

function initCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isHint: false,
        isSafeClick: false,
    }
}

function changeSmiley(str) {
    const elSmiley = document.querySelector(`span1`)
    elSmiley.innerHTML = str

    setTimeout(() => {
        if (gGame.isOn) elSmiley.innerHTML = '😃'
    }, 1000 * 1)
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
                if (!currCell.isMarked && !currCell.isShown) {
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
                    gGame.score += neighborCell.minesAroundCount
                    gGame.shownCount++
                    // If the neighbor has no neighbors, expand it
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
    gGame.hintsUsed = 0
    gGame.markedCount = 0
    gGame.minesplaced = 0
    gGame.lives = LIVES
    gGame.hints = HINTS
    gGame.safeClicks = SAFECLICKS
    gGame.isOn = true
    gGame.hintClicked = false

    gameStateHistory = []

    const elHintButton = document.querySelector('.hint-button')
    elHintButton.classList.remove('hint-button-clicked')

    // Reset the board and render
    gBoard = createBoard(gCurrLevel.SIZE, gCurrLevel.SIZE)
    renderBoard(gBoard, '.board-container')

    onInit()
}

function addMines(board, totalMines) {
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
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) {
                currCell.isShown = true
            }
        }
    }
}

function setLevel(lvl) {
    if (lvl === 'beginner') {
        gCurrLevel = gLevel.beginner
    }
    if (lvl === 'medium') {
        gCurrLevel = gLevel.medium
    }
    if (lvl === 'expert') {
        gCurrLevel = gLevel.expert
    }

    resetGame()
}

function toggleDarkMode() {
    const body = document.body
    body.classList.toggle('dark-mode')
}

function saveGameState() {
    const gameState = {
        game: { ...gGame },
        board: cloneBoard(gBoard)
    }

    gameStateHistory.push(gameState)
    currGameStateIdx = gameStateHistory.length - 1
}

function undo() {
    if (currGameStateIdx > 0) {
        currGameStateIdx--

        var previousMove = gameStateHistory[currGameStateIdx]

        if (previousMove) {

            gGame = previousMove.game
            gBoard = previousMove.board

            updateHints()
            updateLives()
            updateSafeClicks()

            renderBoard(gBoard, '.board-container')

        } else console.error('Invalid previous move.')

    } else console.log('Already at starting point')
}

function cloneBoard(board) {
    var clonedBoard = []
    for (var i = 0; i < board.length; i++) {
        var clonedRow = []
        for (var j = 0; j < board[i].length; j++) {
            clonedRow.push(cloneCell(board[i][j]))
        }
        clonedBoard.push(clonedRow)
    }
    return clonedBoard
}


function cloneCell(cell) {

    return { ...cell}
}

function toggleManualMode() {
    gGame.manualMode = !gGame.manualMode
    const placeButton = document.querySelector('.place-button')
    placeButton.classList.toggle('manual-mode-on', gGame.manualMode)
    
}
