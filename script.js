let box = document.querySelectorAll('.box')
let promptBtn = document.querySelectorAll('.promptBtn');
let buttonSelect = document.getElementsByClassName('buttonSelect');


let playerOne = [];
let playerTwo = [];
let playerTurn = null;

let playState = false;
let drawState = null




for (const e of buttonSelect) {
    e.addEventListener('click', () => {
        playerTurn = e.textContent;
        playState = true;
        console.log(`playState: ${playState}`)
        console.log('initial symbol: ' + playerTurn)
    })
}

function switchSymbol(e) {
    switch (playerTurn) {
        case 'X':
            gridChecker(playerOne, parseInt(e.getAttribute('data-num')), playerTurn)
            winChecker(playerOne, playerTurn)
            e.textContent = playerTurn;
            playerTurn = 'O';
            break;
        case 'O':
            gridChecker(playerTwo, parseInt(e.getAttribute('data-num')), playerTurn)
            winChecker(playerTwo, playerTurn)
            e.textContent = playerTurn;
            playerTurn = 'X';
            break;
        default:
            break;
    }
}


box.forEach(e => {
    e.addEventListener('click', () => {
        if (e.textContent === 'X' || e.textContent === 'O' || playerTurn === null || playState === false) {
            return;
        }
        switchSymbol(e)
        drawChecker()
    })
});



function gridChecker(array, item, arrayName) {
    array.push(item);
    array.sort();
    console.log(arrayName + ': ' + array)
}


const winPattern = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
]

function winChecker(array, arrayName){
    winPattern.forEach(pattern => {
        const isPresent = pattern.every(elem => array.includes(elem));
        if (isPresent) {
            console.log(`${arrayName} wins!`)
            playState = false;
            drawState = false;
        }

    });
   
}


function drawChecker() {
    for (const div of box) {
        if (!div.textContent) {
            return false;
        }
    }
    if(drawState === null){
    return console.log('draw');
    }
}

