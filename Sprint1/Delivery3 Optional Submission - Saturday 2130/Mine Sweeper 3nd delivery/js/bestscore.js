'use strict'


function getBestScore() {
    const storedScore = localStorage.getItem(`bestScore-${gCurrLevel}`)
    
    if (!storedScore || isNaN(storedScore)) {
        localStorage.setItem(`bestScore-${gCurrLevel}`, 0)
        return 0
    }

    return parseInt(storedScore)
}

function updateBestScore(newScore) {
    const currBestScore = getBestScore()

    if (newScore > currBestScore) {
        localStorage.setItem(`bestScore-${gCurrLevel}`, newScore.toString())
        console.log('New best score:', newScore + '\nGood job!')

        const elBestScore = document.querySelector('#best-score')
        elBestScore.innerHTML = newScore.toString()
    }
}




function printBestScore() {

    console.log('Best score:', + getBestScore())
}