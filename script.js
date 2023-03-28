const box = document.querySelectorAll('.box')
const promptBtn = document.querySelectorAll('.promptBtn');
const buttonSelect = document.getElementsByClassName('buttonSelect');
const titleScreen = document.querySelector('#titleScreen');
const chooseBox = document.querySelector('#chooseBox')
const gameContainer = document.querySelector('#container');
const resultScreen = document.querySelector('#resultScreen');
const retryBtn = document.querySelector('#retryBtn');
const playerScoreIndicator = document.querySelector('#playerScoreIndicator')
const playerTurnIndicator = document.querySelector('#playerTurnIndicator')
const playerTurnText = document.querySelector("#playerTurnText")
const playerOneScore = document.querySelector('#playerOneScore')
const playerTwoScore = document.querySelector('#playerTwoScore')
const drawScore = document.querySelector('#drawScore')




let playerOne = [];
let playerTwo = [];
let playerTurn = null;

let playState = false;
let drawState = null;

let pointState = null;

let playerX = 0;
let playerO = 0;
let draw = 0;
let winnerState;
let winnerArray = [];


for (const e of buttonSelect) {
    e.addEventListener('click', () => {
        const startTl = gsap.timeline();

        playerTurn = e.textContent;
        changePlayerTurn(playerTurn);
        playState = true;
        console.log(`playState: ${playState}`)
        console.log('initial symbol: ' + playerTurn)

        startTl.fromTo(e, { scale: .8, ease: 'expo.out' }, { scale: 1, ease: 'expo.out' })
        startTl.to(chooseBox, { opacity: 0, display: 'none', ease: "expo.out" }, '<')
        startTl.to(titleScreen, { y: -100, fontSize: '4rem', ease: "expo.out" })
        startTl.fromTo(playerScoreIndicator, { display: 'none', opacity: 0, y: -100, ease: 'expo.out' }, { display: 'flex', opacity: 1, y: 0, ease: 'expo.out' }, '<')
        startTl.fromTo(playerTurnIndicator, { display: 'none', opacity: 0, y: -100, ease: 'expo.out' }, { display: 'initial', opacity: 1, y: 0, ease: 'expo.out' }, '<')
        startTl.to(container, { display: 'grid', scale: 1, opacity: 1, ease: "expo.out" }, '<.1')
        startTl.from(box, { opacity: 0, scale: .5, stagger: 0.02, ease: "expo.out" }, '<')


    })
}

function switchSymbol(e) {
    switch (playerTurn) {
        case 'X':
            gridChecker(playerOne, parseInt(e.getAttribute('data-num')))
            winChecker(playerOne, playerTurn)
            e.textContent = playerTurn;
            playerTurn = 'O';
            break;
        case 'O':
            gridChecker(playerTwo, parseInt(e.getAttribute('data-num')))
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
        gsap.fromTo(e, { scale: .5, ease: "expo.out" }, { scale: 1, border: 'none', ease: "expo.out" })
        switchSymbol(e)
        changePlayerTurn(playerTurn)
        drawChecker()
    })
});


function gridChecker(array, item) {
    array.push(item);
    array.sort();
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

function winChecker(array, arrayName) {
    winPattern.forEach(pattern => {
        const isPresent = pattern.every(elem => array.includes(elem));
        if (isPresent) {
            playState = false;
            drawState = false;
            winnerArray = pattern;
            winnerIndicator(playerTurn);
            console.log(winnerArray)
            setTimeout(retryScreen, 2000);
        }
    });

}


function drawChecker() {
    for (const div of box) {
        if (!div.textContent) {
            return false;
        }
    }
    if (drawState === null) {
        winnerIndicator(playerTurn);
        setTimeout(retryScreen, 2000);
    }
}



for (const e of box) {
    e.addEventListener('pointerenter', () => {
        if (playState === false) {
            return
        }
        gsap.to(e, { border: 'solid 2px #FF7A90', ease: "expo.out" })
    })
}

for (const e of box) {
    e.addEventListener('pointerleave', () => {
        if (playState === false) {
            return
        }
        gsap.to(e, { border: 'none', ease: "expo.out" })
    })
}


function retryScreen() {
    let winner = document.querySelector('#winner');
    gsap.fromTo(resultScreen, { display: 'grid', opacity: 0, backdropFilter: 'blur(0px)', ease: "expo.inout" }, { opacity: 1, backdropFilter: 'blur(5px)', ease: "expo.inout" })
    if (drawState === null) {
        winner.textContent = `It's a Draw!`;
    }

    if (drawState === false) {
        return
        // winner.textContent = `${winner} wins!`;
    }
}


function allReset() {
    drawState = null;
    playerOne = [];
    playerTwo = [];
    playState = true;
    pointState = null

    gsap.to(resultScreen, { opacity: 0, display: 'none', ease: "expo.out" })
    gsap.to(box, { textContent: '', border: 'none', ease: 'expo.out' })
    gsap.from(box, { scale: 0, stagger: 0.05, ease: "expo.out" })
    playerTurn = 'X'
}


retryBtn.addEventListener('click', () => {
    gsap.fromTo(retryBtn, { scale: .8, ease: "expo.out" }, { scale: 1, ease: "expo.out" })
    allReset()
})

//Add winning pattern animation using data attributes and winningPattern


function changePlayerTurn(playerTurn) {
    gsap.to(playerTurnText, { textContent: `${playerTurn}`, ease: "expo.out" })
}

function winnerIndicator(playerTurn) {
    if (playerTurn === 'X' && drawState === false) {
        pointState = 0;
        highlightWinner(winnerArray)
        pointIndicator(pointState);
        winnerState = 'X';
    } else if (playerTurn === 'O' && drawState === false) {
        pointState = 1;
        highlightWinner(winnerArray)
        console.log(playerTwo)
        winnerState = 'O';
        pointIndicator(pointState);
    } else if (drawState === null) {
        pointState = 2;
        pointIndicator(pointState);
        winnerState = 'Draw';
    }
    return;
}

function pointIndicator(pointState) {

    switch (pointState) {
        case 0:
            playerOneScore.textContent = `${++playerX}`
            break;

        case 1:
            console.log(playerO)
            playerTwoScore.textContent = `${++playerO}`
            break;

        case 2:
            drawScore.textContent = `${++draw}`
            break;

        default:
            break;
    }
}



function highlightWinner(winnerArray) {
    const squares = document.querySelectorAll('[data-num]');
    squares.forEach((e) => {
        winnerArray.forEach((i) => {
            if (parseInt(e.getAttribute('data-num')) === i) {
                gsap.to(e, { scale: .8, border: 'solid 2px #FF7A90', ease: 'expo.out' }, '<.1')
                gsap.to(e, { scale: 1, ease: 'expo.out', delay: .2 }, '<.1')
            }
        })
    })
}








//Create score indicator


    //CREATE playerTurn randomizer