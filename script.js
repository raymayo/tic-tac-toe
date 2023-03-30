let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const box = document.querySelectorAll('.box');
const promptBtn = document.querySelectorAll('.promptBtn');
const buttonSelect = document.getElementsByClassName('buttonSelect');

let playerOne = [];
let playerTwo = [];
let playerTurn = null;

let ifPlaying = false;
let drawState = null;
let scoreIndicator = null;

let winnerState;
let winnerArray = [];

window.onload = function () {
	const loadedTl = gsap.timeline();

	loadedTl.from(titleScreen, { opacity: 0, y: -200, ease: 'expo.out' });
	loadedTl.from(chooseBox, { opacity: 0, y: 100, ease: 'expo.out' });
};

for (const e of buttonSelect) {
	e.addEventListener('click', () => {
		const startTl = gsap.timeline();

		playerTurn = e.textContent;
		playerTurnHUD(playerTurn);
		ifPlaying = true;

		startTl.fromTo(
			e,
			{ scale: 0.5, ease: 'expo.out' },
			{ scale: 1, ease: 'expo.out' }
		);
		startTl.to(
			chooseBox,
			{ opacity: 0, display: 'none', ease: 'expo.out' },
			'<'
		);
		startTl.to(titleScreen, { y: -80, fontSize: '4rem', ease: 'expo.out' });
		startTl.fromTo(
			playerScoreIndicator,
			{ display: 'none', opacity: 0, y: -100, ease: 'expo.out' },
			{ display: 'flex', opacity: 1, y: 0, ease: 'expo.out' },
			'<'
		);
		startTl.fromTo(
			playerTurnIndicator,
			{ display: 'none', opacity: 0, y: -100, ease: 'expo.out' },
			{ display: 'initial', opacity: 1, y: 0, ease: 'expo.out' },
			'<'
		);
		startTl.to(
			container,
			{ display: 'grid', scale: 1, opacity: 1, ease: 'expo.out' },
			'<.1'
		);
		startTl.from(
			box,
			{ opacity: 0, scale: 0.5, stagger: 0.02, ease: 'expo.out' },
			'<'
		);
	});
}

function switchSymbol(e) {
	switch (playerTurn) {
		case 'X':
			gridChecker(playerOne, parseInt(e.getAttribute('data-num')));
			winChecker(playerOne, playerTurn);
			e.textContent = playerTurn;
			playerTurn = 'O';
			break;
		case 'O':
			gridChecker(playerTwo, parseInt(e.getAttribute('data-num')));
			winChecker(playerTwo, playerTurn);
			e.textContent = playerTurn;
			playerTurn = 'X';
			break;
		default:
			break;
	}
}

box.forEach((e) => {
	e.addEventListener('click', () => {
		if (e.textContent !== '' || playerTurn === null || ifPlaying === false) {
			return;
		}
		gsap.fromTo(
			e,
			{ scale: 0.5, ease: 'expo.out' },
			{ scale: 1, border: 'none', ease: 'expo.out' }
		);
		switchSymbol(e);
		playerTurnHUD(playerTurn);
		drawChecker();
	});
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
];

function winChecker(array) {
	winPattern.forEach((pattern) => {
		const isPresent = pattern.every((elem) => array.includes(elem));
		if (isPresent) {
			ifPlaying = false;
			drawState = false;
			winnerArray = pattern;
			winnerIndicator(playerTurn);
			setTimeout(retryScreen, 1500);
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
		setTimeout(retryScreen, 500);
	}
}

for (const e of box) {
	e.addEventListener('pointerenter', () => {
		if (ifPlaying === false) {
			return;
		}
		gsap.to(e, { border: 'solid 2px #FF7A90', ease: 'expo.out' });
	});
}

for (const e of box) {
	e.addEventListener('pointerleave', () => {
		if (ifPlaying === false) {
			return;
		}
		gsap.to(e, { border: 'none', ease: 'expo.out' });
	});
}

function retryScreen() {
	gsap.fromTo(
		resultScreen,
		{ display: 'grid', opacity: 0, ease: 'expo.inout' },
		{ opacity: 1, ease: 'expo.inout' }
	);
	if (drawState === null) {
		winner.textContent = `Draw!`;
	}
}

function allReset() {
	drawState = null;
	playerOne = [];
	playerTwo = [];
	ifPlaying = true;
	scoreIndicator = null;

	gsap.to(resultScreen, { opacity: 0, display: 'none', ease: 'expo.out' });
	gsap.to(box, { textContent: '', border: 'none', ease: 'expo.out' });
	gsap.from(box, { scale: 0, stagger: 0.05, ease: 'expo.out' });

	nextGameTurn(winnerState);
}

retryBtn.addEventListener('click', () => {
	gsap.fromTo(
		retryBtn,
		{ scale: 0.8, ease: 'expo.out' },
		{ scale: 1, ease: 'expo.out' }
	);
	allReset();
});

function playerTurnHUD(playerTurn) {
	gsap.to(playerTurnText, { textContent: `${playerTurn}`, ease: 'expo.out' });
}

function winnerIndicator(playerTurn) {
	if (playerTurn === 'X' && drawState === false) {
		scoreIndicator = 0;
		highlightWinner(winnerArray);
		scoreHUDIndicator(scoreIndicator);
		winnerState = 'X';
		winner.textContent = 'X wins!';
	} else if (playerTurn === 'O' && drawState === false) {
		scoreIndicator = 1;
		highlightWinner(winnerArray);
		winnerState = 'O';
		winner.textContent = 'O wins!';
		scoreHUDIndicator(scoreIndicator);
	} else if (drawState === null) {
		scoreIndicator = 2;
		scoreHUDIndicator(scoreIndicator);
		winnerState = 'Draw';
	}
	return;
}

function scoreHUDIndicator(scoreIndicator) {
	let X_SCORE = 0;
	let O_SCORE = 0;
	let DRAW_SCORE = 0;

	switch (scoreIndicator) {
		case 0:
			playerOneScore.textContent = `${++X_SCORE}`;
			break;

		case 1:
			playerTwoScore.textContent = `${++O_SCORE}`;
			break;

		case 2:
			drawScore.textContent = `${++DRAW_SCORE}`;
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
				gsap.to(
					e,
					{ scale: 0.8, border: 'solid 2px #FF7A90', ease: 'expo.out' },
					'<.1'
				);
				gsap.to(e, { scale: 1, ease: 'expo.out', delay: 0.2 }, '<.1');
			}
		});
	});
}

function nextGameTurn(winnerState) {
	switch (winnerState) {
		case 'X':
			playerTurn = 'O';
			break;

		case 'O':
			playerTurn = 'X';
			break;

		case 'Draw':
			const choices = ['X', 'O'];
			const randomIndex = Math.floor(Math.random() * 2);
			playerTurn = choices[randomIndex];
			break;

		default:
			break;
	}
}

github.addEventListener('pointerenter', () => {
	gsap.fromTo(
		github,
		{ rotate: 0, ease: 'expo.inout' },
		{ rotate: 360, ease: 'expo.inout' }
	);
});

github.addEventListener('pointerleave', () => {
	gsap.fromTo(
		github,
		{ rotate: 360, ease: 'expo.inout' },
		{ rotate: 0, ease: 'expo.inout' }
	);
});
