const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelTitle = document.getElementById('level-title');
const moveDisplay = document.getElementById('move-count');

// Configuração simplificada
let playerPos = { x: 1, y: 1 };
const TILE_SIZE = 80;

// Grade de teste: 1 = Jogador, 2 = Objetivo, -1 = Parede, 0 = Caminho
let grid = [
    [-1, -1, -1, -1, -1],
    [-1,  1,  0,  0, -1],
    [-1,  0, -1,  0, -1],
    [-1,  0,  0,  2, -1],
    [-1, -1, -1, -1, -1]
];

function draw() {
    // Limpa o fundo
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            if (cell === -1) { // Parede
                ctx.fillStyle = "#2d3436";
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            } else if (cell === 1) { // Jogador
                ctx.fillStyle = "#0984e3";
                ctx.fillRect(px + 10, py + 10, TILE_SIZE - 20, TILE_SIZE - 20);
            } else if (cell === 2) { // Objetivo
                ctx.fillStyle = "#00b894";
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE/2, py + TILE_SIZE/2, 20, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    });
}

// Movimentação
window.addEventListener('keydown', (e) => {
    let dx = 0, dy = 0;
    if (e.key === "ArrowUp") dy = -1;
    if (e.key === "ArrowDown") dy = 1;
    if (e.key === "ArrowLeft") dx = -1;
    if (e.key === "ArrowRight") dx = 1;

    const nextX = playerPos.x + dx;
    const nextY = playerPos.y + dy;

    if (grid[nextY][nextX] !== -1) {
        grid[playerPos.y][playerPos.x] = 0;
        playerPos = { x: nextX, y: nextY };
        grid[playerPos.y][playerPos.x] = 1;
        draw();
    }
});

// Força o primeiro desenho
levelTitle.innerText = "Fase de Teste";
draw();
