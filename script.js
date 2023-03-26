let box = document.querySelectorAll('.box')
let promptBtn = document.querySelectorAll('.promptBtn');
let buttonSelect = document.getElementsByClassName('buttonSelect');
let titleScreen = document.querySelector('#titleScreen');
let chooseBox = document.querySelector('#chooseBox')
let gameContainer = document.querySelector('#container');
let resultScreen = document.querySelector('#resultScreen');
let retryBtn = document.querySelector('#retryBtn');


let playerOne = [];
let playerTwo = [];
let playerTurn = null;

let playState = false;
let drawState = null




for (const e of buttonSelect) {
    e.addEventListener('click', () => {
        const startTl = gsap.timeline();

        playerTurn = e.textContent;
        playState = true;
        console.log(`playState: ${playState}`)
        console.log('initial symbol: ' + playerTurn)
        startTl.to(chooseBox, {scale:.8 ,opacity: 0, display: 'none', ease: "expo.out" })
        startTl.to(titleScreen, { y:-100,fontSize: '4rem', ease: "expo.out" })
        startTl.to(container,{ display: 'grid', scale: 1, opacity: 1, ease: "expo.out" },'<.1')
        startTl.from(box, { opacity: 0, scale: .5, stagger: 0.02, ease: "expo.out" },'<')
        // chooseBox.style.display = 'none';
        // container.style.display = 'grid';
        // titleScreen.style.fontSize = '3rem'

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
        gsap.fromTo(e, { scale: .5, ease: "expo.out" }, { scale: 1, ease: "expo.out" })
        switchSymbol(e)
        drawChecker()
    })
});





function gridChecker(array, item, arrayName) {
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

function winChecker(array, arrayName){
    winPattern.forEach(pattern => {
        const isPresent = pattern.every(elem => array.includes(elem));
        if (isPresent) {
            console.log(`${arrayName} wins!`)
            playState = false;
            drawState = false;
            retryScreen();
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
    return retryScreen();
    }
}



for (const e of box) {
    e.addEventListener('pointerenter', () => {
        gsap.to(e, { backgroundColor: '#1E2633', ease: "expo.out" })
    })
}

for (const e of box) {
    e.addEventListener('pointerleave', () => {
        gsap.to(e, { backgroundColor: '#263041', ease: "expo.out" })
    })
}


function retryScreen(){
    let winner = document.querySelector('#winner');
    gsap.fromTo(resultScreen, { display: 'grid', opacity: 0, ease: "expo.out" }, { opacity: 1, ease: "expo.out", delay: .3})
    if (drawState === null){
        winner.textContent = `It's a Draw!`;
    }

    if (drawState === false) {
        winner.textContent = `${playerTurn} wins!`;
    }
}


function allReset(){
    drawState = null;
    playerOne = [];
    playerTwo = [];
    playState = true;

    gsap.to(resultScreen, { opacity: 0, display: 'none',  ease: "expo.out" })

    for (const e of box) {
        e.textContent = ''
    }
    playerTurn = 'X'

    //CREATE playerTurn randomizer
}


retryBtn.addEventListener('click', ()=>{
    allReset()
})

//Add winning pattern animation using data attributes and winningPattern


//Create playerTurn indicator

//Create score indicator