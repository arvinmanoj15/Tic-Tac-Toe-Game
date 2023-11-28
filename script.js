const cells = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('gameBoard');
const playerTurnElement = document.getElementById('playerTurn');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgainButton');

const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        cell.innerHTML = ''; // Clear the marks from the cell
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('active');
}


function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    if (cell.textContent === '') { // Check if the cell is empty
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}


function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('active');
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    const mark = document.createElement('div');
    mark.classList.add('mark');
    mark.innerText = currentClass === CIRCLE_CLASS ? 'O' : 'X';
    cell.appendChild(mark);
}


function swapTurns() {
    circleTurn = !circleTurn;
    playerTurnElement.textContent = circleTurn ? "PLAYER 2'S TURN (O)" : "PLAYER 1'S TURN (X)";
}

function setBoardHoverClass() {
    gameBoard.classList.remove(X_CLASS, CIRCLE_CLASS);
    if (circleTurn) {
        gameBoard.classList.add(CIRCLE_CLASS);
    } else {
        gameBoard.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
