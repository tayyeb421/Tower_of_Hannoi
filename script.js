
// Tower of Hanoi Game

const towers = [
    document.getElementById("tower1"),
    document.getElementById("tower2"),
    document.getElementById("tower3")
];

// Buttons
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const solveBtn = document.getElementById("solveBtn");
const playAgain = document.getElementById("playAgain");

// Inputs
const diskCountSelect = document.getElementById("diskCount");

// Info
const moveCountText = document.getElementById("moveCount");
const minimumMovesText = document.getElementById("minimumMoves");
const timerText = document.getElementById("timer");

// Popup
const popup = document.getElementById("popup");
const finalMoves = document.getElementById("finalMoves");


// Variables


let diskCount = 3;
let moveCount = 0;

let selectedTower = null;

let timer = 0;
let timerInterval = null;

let towerData = [
    [],
    [],
    []
];


// Initialize Game


function initializeGame() {

    diskCount = Number(diskCountSelect.value);

    moveCount = 0;
    timer = 0;

    moveCountText.textContent = 0;

    minimumMovesText.textContent = Math.pow(2, diskCount) - 1;

    timerText.textContent = "00 : 00";

    popup.style.display = "none";

    clearInterval(timerInterval);

    towerData = [
        [],
        [],
        []
    ];

    towers.forEach(tower => {

        tower.innerHTML = '<div class="rod"></div>';

    });

    createDisks();
}


// Create Disks


function createDisks() {

    for (let size = diskCount; size >= 1; size--) {

        const disk = document.createElement("div");

        disk.classList.add("disk");

        disk.dataset.size = size;

        disk.style.width = `${60 + size * 25}px`;

        disk.style.bottom = `${(diskCount - size) * 26}px`;

        disk.textContent = size;

        towers[0].appendChild(disk);

        towerData[0].push(size);

    }

}

// Start Timer
function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timer++;

        const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
        const seconds = String(timer % 60).padStart(2, "0");

        timerText.textContent = `${minutes} : ${seconds}`;

    }, 1000);
}

towers.forEach((tower, index) => {

    tower.addEventListener("click", () => {

        handleTowerClick(index);

    });

});

// Handle Tower Click

function handleTowerClick(index) {

    // First Click → Select Tower
    if (selectedTower === null) {

        if (towerData[index].length === 0) return;

        selectedTower = index;

        towers[index].classList.add("selected");

        return;
    }

    // Second Click → Move Disk
    if (selectedTower === index) {

        towers[selectedTower].classList.remove("selected");

        selectedTower = null;

        return;
    }

    moveDisk(selectedTower, index);

    towers[selectedTower].classList.remove("selected");

    selectedTower = null;
}

// Move Disk

function moveDisk(from, to) {

    if (towerData[from].length === 0) return;

    const movingDisk = towerData[from][towerData[from].length - 1];

    const targetDisk = towerData[to][towerData[to].length - 1];

    // Invalid Move
    if (targetDisk && movingDisk > targetDisk) {

        alert("Invalid Move!");

        return;
    }

    // Remove From Source
    towerData[from].pop();

    // Add To Destination
    towerData[to].push(movingDisk);

    moveCount++;

    moveCountText.textContent = moveCount;

    updateBoard();

    checkWin();
}

// Update Board
function updateBoard() {

    // Clear Towers
    towers.forEach(tower => {

        tower.innerHTML = '<div class="rod"></div>';

    });

    // Draw Disks
    towerData.forEach((tower, towerIndex) => {

        tower.forEach((size, diskIndex) => {

            const disk = document.createElement("div");

            disk.classList.add("disk");

            disk.dataset.size = size;

            disk.style.width = `${60 + size * 25}px`;

            disk.style.bottom = `${diskIndex * 26}px`;

            disk.textContent = size;

            towers[towerIndex].appendChild(disk);

        });

    });

}

// Check Win

function checkWin() {

    if (towerData[2].length === diskCount) {

        clearInterval(timerInterval);

        finalMoves.textContent = moveCount;

        popup.style.display = "flex";

    }

}

// Start Game
startBtn.addEventListener("click", () => {

    initializeGame();

    startTimer();

});

// Restart Game
restartBtn.addEventListener("click", () => {

    initializeGame();

    startTimer();

});

// Play Again
playAgain.addEventListener("click", () => {

    initializeGame();

    startTimer();

});

// Delay Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Recursive Auto Solve
async function solveHanoi(n, from, to, aux) {

    if (n === 0) return;

    await solveHanoi(n - 1, from, aux, to);

    // Move Disk
    towerData[to].push(towerData[from].pop());

    moveCount++;
    moveCountText.textContent = moveCount;

    updateBoard();

    await sleep(500);

    await solveHanoi(n - 1, aux, to, from);
}

// Auto Solve Button
solveBtn.addEventListener("click", async () => {

    // Disable buttons while solving
    startBtn.disabled = true;
    restartBtn.disabled = true;
    solveBtn.disabled = true;

    clearInterval(timerInterval);
    startTimer();

    await solveHanoi(diskCount, 0, 2, 1);

    clearInterval(timerInterval);

    checkWin();

    // Enable buttons
    startBtn.disabled = false;
    restartBtn.disabled = false;
    solveBtn.disabled = false;

});

initializeGame();
