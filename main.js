// 1. Configurações e Dados das Fases (Embutido para evitar erros de carregamento)
const gameData = {
    levels: [
        {
            id: 1,
            title: "O Início",
            grid: [
                [1, 0, 0, 0],
                [-1, -1, 0, 0],
                [0, 0, 0, 2]
            ]
        },
        {
            id: 2,
            title: "Zigue-Zague",
            grid: [
                [1, -1, 0, 0],
                [0, -1, 0, -1],
                [0, 0, 0, 2]
            ]
        }
    ]
};

// 2. Referências do DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelTitle = document.getElementById('level-title');
const moveDisplay = document.getElementById('move-count');

// 3. Estado do Jogo
let currentLevelIndex = 0;
let moves = 0;
let playerPos = { x: 0, y: 0 };
let currentGrid = [];
const TILE_SIZE = 80;

// 4. Inicializar Fase
function initLevel(index) {
    const level = gameData.levels[index];
    if (!level) {
        alert("Você venceu todos os níveis!");
        return;
    }

    currentLevelIndex = index;
    levelTitle.innerText = level.title;
    moves = 0;
    moveDisplay.innerText = moves;
    
    // Copia a grade para não alterar o original
    currentGrid = JSON.parse(JSON.stringify(level.grid));

    // Localiza o jogador (1)
    for (let y = 0; y < currentGrid.length; y++) {
        for (let x = 0; x < currentGrid[y].length; x++) {
            if (currentGrid[y][x] === 1) {
                playerPos = { x, y };
            }
        }
    }
    draw();
}

// 5. Desenhar o Jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            // Chão
            ctx.strokeStyle = "#eee";
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

            if (cell === -1) { // Parede
                ctx.fillStyle = "#2d3436";
                ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            } else if (cell === 1) { // Jogador
                ctx.fillStyle = "#0984e3";
                ctx.beginPath();
                ctx.roundRect(px + 10, py + 10, TILE_SIZE - 20, TILE_SIZE - 20, 10);
                ctx.fill();
            } else if (cell === 2) { // Objetivo
                ctx.fillStyle = "#00b894";
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE/2, py + TILE_SIZE/2, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    });
}

// 6. Lógica de Movimento
function move(dx, dy) {
    const nextX = playerPos.x + dx;
    const nextY = playerPos.y + dy;

    // Checar limites e paredes
    if (nextY >= 0 && nextY < currentGrid.length && 
        nextX >= 0 && nextX < currentGrid[0].length &&
        currentGrid[nextY][nextX] !== -1) {

        // Se for o objetivo (2)
        if (currentGrid[nextY][nextX] === 2) {
            moves++;
            moveDisplay.innerText = moves;
            setTimeout(() => {
                alert("Nível Concluído!");
                initLevel(currentLevelIndex + 1);
            }, 100);
            return;
        }

        // Move o jogador na matriz
        currentGrid[playerPos.y][playerPos.x] = 0;
        playerPos = { x: nextX, y: nextY };
        currentGrid[playerPos.y][playerPos.x] = 1;
        
        moves++;
        moveDisplay.innerText = moves;
        draw();
    }
}

// 7. Controles
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") move(0, -1);
    if (e.key === "ArrowDown") move(0, 1);
    if (e.key === "ArrowLeft") move(-1, 0);
    if (e.key === "ArrowRight") move(1, 0);
});

// Começar!
initLevel(0);
