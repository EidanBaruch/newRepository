'use strict'



function createBoard(rows, cols) {
    var board = []

    // Loop rows to create each row
    for (var i = 0; i < rows; i++) {
        var row = []

        // Loop through columns to loop each element in the row
        for (var j = 0; j < cols; j++) {

            row.push(initCell())
        }

        // Add the row to the mat
        board.push(row)
    }

    
    //board[0][2] = MINE
    //board[3][3] = MINE

    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var classList = [`cell cell-${i}-${j}`]
            var displayValue = cell.isShown ? cell.minesAroundCount : ' '
            
            if (cell.isShown) {

                if(cell.isMine) {

                    displayValue = MINE
                } else {

                    var colorMinesAroundCount = getNegsCountColored(cell.minesAroundCount)
                    displayValue = colorMinesAroundCount
                }

                //displayValue = cell.isMine ? MINE : cell.minesAroundCount


                // Add a class to the clicked cell
                classList.push('clicked-cell')
            
                if (cell.isMine) classList.push('clicked-mine')
            } else if (cell.isMarked) {
                displayValue = FLAG
                classList.push('marked-cell')
            } else if (cell.isSafeClick) {
                classList.push('safe-cell')
            }
            
            strHTML += `<td class="${classList.join(' ')}"
                    onclick="onCellClicked(event, this)"
                    oncontextmenu="onCellRightClicked(event, this);
                    return false;"
                    onmouseover="onHoverCell(event, this, ${i}, ${j}, true)"
                    onmouseout="onHoverCell(event, this, ${i}, ${j}, false)">${displayValue}</td>`;
            
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}



// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function findRandomEmptyCell(board) {
    const emptyCells = []

    // Iterate through the matrix and find empty cells
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }

    // If there are no empty cells, return null
    if (emptyCells.length === 0) {
        return null
    }

    // Return a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
}

function findInMatrix(matrix, searchStr) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === searchStr) {
                return true // Found the string
            }
        }
    }
    return false // String not found
}

function getNegsCountColored(negsCount) {

    if(negsCount === 1) return `<span style="color: blue;">${negsCount}</span>`
    if(negsCount === 2) return `<span style="color: green;">${negsCount}</span>`
    if(negsCount === 3) return `<span style="color: red;">${negsCount}</span>`
    if(negsCount === 4) return `<span style="color: yellow;">${negsCount}</span>`
    if(negsCount === 5) return `<span style="color: brown;">${negsCount}</span>`
    if(negsCount === 6) return `<span style="color: black;">${negsCount}</span>`
    if(negsCount === 7) return `<span style="color: yellow;">${negsCount}</span>`
    if(negsCount === 8) return `<span style="color: green;">${negsCount}</span>`
    
    // return an empty string if no neighbors around (avoiding 0)
    return ''
}
