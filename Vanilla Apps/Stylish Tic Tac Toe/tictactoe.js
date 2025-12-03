const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('startBtn');
const modeSelect = document.getElementById('modeSelect');
const startSelect = document.getElementById('startSelect');
const symbolSelect = document.getElementById('symbolSelect');

let mode = "multi"; // "single" o "multi"
let player1Symbol = "X";
let player2Symbol = "O";
let currentPlayer = "X";
let humanPlayer = "X";
let aiPlayer = "O";

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let running = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    resetButton.addEventListener('click', resetGame);
    startButton.addEventListener('click', applySettings);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function applySettings() {
    // Obtener configuración
    mode = modeSelect.value;
    player1Symbol = symbolSelect.value;
    player2Symbol = player1Symbol === "X" ? "O" : "X";
    
    const whoStarts = startSelect.value;
    currentPlayer = whoStarts === "player1" ? player1Symbol : player2Symbol;
    
    // Configurar jugadores para modo single player
    if (mode === "single") {
        humanPlayer = player1Symbol;
        aiPlayer = player2Symbol;
    }
    
    // Reiniciar el juego con la nueva configuración
    resetGame();
    console.log("Cambios de configuracion detectado.")
    
    // Si es modo single player y la máquina inicia, hacer el primer movimiento
    /*if (mode === "single" && currentPlayer === aiPlayer) {
        statusText.textContent = "AI is thinking...";
        setTimeout(() => {
            aiMove();
        }, 500);
    }*/
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-cell-index');
    
    if (options[cellIndex] !== "" || !running) {
        return;
    }
    
    // En modo single player, solo permitir clicks si es el turno del humano
    if (mode === "single" && currentPlayer === aiPlayer) {
        return;
    }
    
    updateCell(this, cellIndex);
    checkWinner();
    
    // Si es modo single player y el juego sigue, turno de la máquina
    if (mode === "single" && running && currentPlayer === aiPlayer) {
        statusText.textContent = "AI is thinking...";
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer === player1Symbol) ? player2Symbol : player1Symbol;
    
    if (mode === "single") {
        statusText.textContent = currentPlayer === humanPlayer ? "Your turn" : "AI's turn";
    } else {
        statusText.textContent = `It's ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    let roundWon = false;
    
    for(let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;   
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }
    
    if (roundWon) {
        if (mode === "single") {
            statusText.textContent = currentPlayer === humanPlayer ? "You win! 🎉" : "AI wins! 🤖";
        } else {
            statusText.textContent = `${currentPlayer} wins! 🎉`;
        }
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `It's a draw! 🤝`;
        running = false;
    } else {
        changePlayer();
    }
}

function aiMove() {
    if (!running) return;
    
    // Obtener celdas vacías usando filter
    const availableCells = options
        .map((cell, index) => cell === "" ? index : null)
        .filter(index => index !== null);
    
    if (availableCells.length === 0) return;
    
    // Seleccionar una celda aleatoria
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomIndex];
    
    // Actualizar la celda
    const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
    updateCell(cell, cellIndex);
    checkWinner();
}

/*function resetGame() {
    currentPlayer = symbolSelect ? symbolSelect.value : "X";
    
    // Si se ha configurado quién inicia
    if (startSelect && startSelect.value === "player2") {
        currentPlayer = player2Symbol;
    }
    
    options = ["", "", "", "", "", "", "", "", ""];
    
    if (mode === "single") {
        statusText.textContent = currentPlayer === humanPlayer ? "Your turn" : "AI's turn";
    } else {
        statusText.textContent = `It's ${currentPlayer}'s turn`;
    }
    
    cells.forEach(cell => cell.textContent = "");
    running = true;
    
    // Si es modo single player y la máquina inicia, hacer movimiento
    if (mode === "single" && currentPlayer === aiPlayer) {
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}*/

function resetGame() {
    // Determinar quién inicia basado en la configuración
    const whoStarts = startSelect ? startSelect.value : "player1";
    currentPlayer = whoStarts === "player1" ? player1Symbol : player2Symbol;
    
    options = ["", "", "", "", "", "", "", "", ""];
    
    if (mode === "single") {
        statusText.textContent = currentPlayer === humanPlayer ? "Your turn" : "AI's turn";
    } else {
        statusText.textContent = `It's ${currentPlayer}'s turn`;
    }
    
    cells.forEach(cell => cell.textContent = "");
    running = true;
    
    // Si es modo single player y la mÃ¡quina inicia, hacer movimiento
    if (mode === "single" && currentPlayer === aiPlayer) {
        statusText.textContent = "AI is thinking...";
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}