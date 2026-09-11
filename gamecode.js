// =========================
// GAME DATA
// =========================

const symbols = [
    "🐟", "🐟",
    "🌸", "🌸",
    "👻", "👻",
    "⚡", "⚡",
    "💎", "💎",
    "⭐", "⭐",
    "🌙", "🌙",
    "🍉", "🍉"
];

let flippedCards = [];

let currentPlayer = 1;

let score1 = 0;
let score2 = 0;

let flips = 0;
let pairsFound = 0;

let lockBoard = false;
let gameStarted = false;


// =========================
// DOM ELEMENTS
// =========================

const gameGrid = document.getElementById("game-grid");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const playAgainBtn = document.getElementById("play-again-btn");

const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

const currentPlayerDisplay =
    document.getElementById("current-player");

const flipCountDisplay =
    document.getElementById("flip-count");

const pairsFoundDisplay =
    document.getElementById("pairs-found");

const winnerOverlay =
    document.getElementById("winner-overlay");

const winnerTitle =
    document.getElementById("winner-title");

const winnerMessage =
    document.getElementById("winner-message");

const playerOneCard =
    document.querySelector(".player-one");

const playerTwoCard =
    document.querySelector(".player-two");

const playerOneTurn =
    document.querySelector(".player-one .turn-label");

const playerTwoTurn =
    document.querySelector(".player-two .turn-label");


// =========================
// SHUFFLE
// Fisher-Yates Algorithm
// =========================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }
}


// =========================
// CREATE GAME BOARD
// =========================

function createBoard() {

    gameGrid.innerHTML = "";

    // Create a copy so the original
    // symbols array is not changed
    const shuffledSymbols = [...symbols];

    shuffle(shuffledSymbols);

    shuffledSymbols.forEach(symbol => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">
                    ${symbol}
                </div>

            </div>
        `;

        card.addEventListener("click", flipCard);

        gameGrid.appendChild(card);
    });
}


// =========================
// FLIP CARD
// =========================

function flipCard() {

    // Don't allow cards before game starts
    if (!gameStarted) return;

    // Don't allow clicks while board is locked
    if (lockBoard) return;

    // Don't click an already flipped card
    if (this.classList.contains("flipped")) return;

    // Don't click an already matched card
    if (this.classList.contains("matched")) return;

    // Don't allow more than 2 cards
    if (flippedCards.length === 2) return;


    // Flip card
    this.classList.add("flipped");

    // Store selected card
    flippedCards.push(this);


    // Once two cards are selected
    if (flippedCards.length === 2) {

        flips++;

        updateFlipCount();

        checkMatch();
    }
}


// =========================
// CHECK MATCH
// =========================

function checkMatch() {

    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    const isMatch =
        card1.dataset.symbol === card2.dataset.symbol;


    if (isMatch) {

        handleMatch();

    } else {

        handleMismatch();
    }
}


// =========================
// MATCH FOUND
// =========================

function handleMatch() {

    const card1 = flippedCards[0];
    const card2 = flippedCards[1];


    // Mark cards as matched
    card1.classList.add("matched");
    card2.classList.add("matched");


    // Give point to current player
    if (currentPlayer === 1) {

        score1++;

    } else {

        score2++;
    }


    pairsFound++;


    // Update screen
    updateScores();
    updatePairs();


    // Clear selected cards
    flippedCards = [];


    // Same player gets another turn
    // because they found a pair

    // Check whether game is finished
    if (pairsFound === 8) {

        endGame();
    }
}


// =========================
// WRONG MATCH
// =========================

function handleMismatch() {

    lockBoard = true;

    const card1 = flippedCards[0];
    const card2 = flippedCards[1];


    // Add shake animation
    card1.classList.add("mismatch");
    card2.classList.add("mismatch");


    setTimeout(() => {

        // Remove shake
        card1.classList.remove("mismatch");
        card2.classList.remove("mismatch");


        // Flip cards back
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");


        // Clear cards
        flippedCards = [];

        lockBoard = false;


        // Switch player
        switchPlayer();

    }, 1000);
}


// =========================
// SWITCH PLAYER
// =========================

function switchPlayer() {

    if (currentPlayer === 1) {

        currentPlayer = 2;

    } else {

        currentPlayer = 1;
    }


    updateTurn();
}


// =========================
// UPDATE TURN UI
// =========================

function updateTurn() {

    currentPlayerDisplay.textContent =
        `PLAYER ${currentPlayer}`;


    if (currentPlayer === 1) {

        playerOneCard.classList.add("active");
        playerTwoCard.classList.remove("active");

        playerOneTurn.textContent = "YOUR TURN";
        playerTwoTurn.textContent = "WAITING";

    } else {

        playerTwoCard.classList.add("active");
        playerOneCard.classList.remove("active");

        playerTwoTurn.textContent = "YOUR TURN";
        playerOneTurn.textContent = "WAITING";
    }
}


// =========================
// UPDATE SCORES
// =========================

function updateScores() {

    score1Display.textContent = score1;

    score2Display.textContent = score2;
}


// =========================
// UPDATE FLIP COUNT
// =========================

function updateFlipCount() {

    flipCountDisplay.textContent = flips;
}


// =========================
// UPDATE PAIRS
// =========================

function updatePairs() {

    pairsFoundDisplay.textContent =
        `${pairsFound} / 8`;
}


// =========================
// START GAME
// =========================

function startGame() {

    gameStarted = true;

    lockBoard = false;

    flippedCards = [];

    currentPlayer = 1;

    score1 = 0;
    score2 = 0;

    flips = 0;
    pairsFound = 0;


    // Reset display
    updateScores();

    updateFlipCount();

    updatePairs();

    updateTurn();


    // Create shuffled board
    createBoard();


    // Change button text
    startBtn.textContent = "GAME STARTED";

    startBtn.disabled = true;
}


// =========================
// RESTART GAME
// =========================

function restartGame() {

    gameStarted = true;

    lockBoard = false;

    flippedCards = [];

    currentPlayer = 1;

    score1 = 0;
    score2 = 0;

    flips = 0;
    pairsFound = 0;


    updateScores();

    updateFlipCount();

    updatePairs();

    updateTurn();


    // Create completely new board
    createBoard();


    startBtn.textContent = "GAME STARTED";

    startBtn.disabled = true;


    // Hide winner screen if open
    winnerOverlay.classList.remove("show");
}


// =========================
// END GAME
// =========================

function endGame() {

    gameStarted = false;

    lockBoard = true;


    let winnerText;
    let message;


    if (score1 > score2) {

        winnerText = "PLAYER 1 WINS!";

        message =
            `Player 1 wins with ${score1} pairs!`;

    } else if (score2 > score1) {

        winnerText = "PLAYER 2 WINS!";

        message =
            `Player 2 wins with ${score2} pairs!`;

    } else {

        winnerText = "IT'S A DRAW!";

        message =
            `Both players found ${score1} pairs!`;
    }


    winnerTitle.textContent = winnerText;

    winnerMessage.textContent = message;


    // Show winner popup
    setTimeout(() => {

        winnerOverlay.classList.add("show");

    }, 700);
}


// =========================
// PLAY AGAIN
// =========================

function playAgain() {

    winnerOverlay.classList.remove("show");

    restartGame();
}


// =========================
// BUTTON EVENTS
// =========================

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", restartGame);

playAgainBtn.addEventListener("click", playAgain);


// =========================
// INITIAL STATE
// =========================

// Board is empty until START GAME
gameGrid.innerHTML = "";

updateScores();
updateFlipCount();
updatePairs();
updateTurn();