const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE = 60;

const levels = [
    { name: "01: O Início", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0, 0, 0, 2,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "02: Zigue-Zague", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0,-1, 0, 0, 0,-1],
        [-1,-1, 0,-1, 0,-1, 0,-1],
        [-1, 2, 0, 0, 0,-1, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "03: O Labirinto", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0, 0,-1, 2,-1],
        [-1, 0,-1,-1, 0,-1, 0,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "04: Corredor Estreito", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0,-1, 0, 0,-1],
        [-1,-1,-1, 0,-1, 0, 2,-1],
        [-1, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "05: Divisória", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0,-1, 0, 2,-1],
        [-1, 0,-1, 0,-1, 0,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "06: Serpente", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0,-1, 2, 0,-1],
        [-1,-1,-1, 0,-1, 0,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1, 0,-1,-1,-1,-1,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "07: Quatro Salas", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0,-1, 0, 0, 0,-1],
        [-1, 0, 0,-1, 0,-1, 0,-1],
        [-1,-1, 0, 0, 0,-1, 2,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "08: Precisão", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0, 0, 0, 0,-1],
        [-1, 0,-1,-1,-1,-1, 0,-1],
        [-1, 0, 0, 0, 2,-1, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "09: A Armadilha", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1,-1, 0, 0, 0, 0,-1],
        [-1, 0,-1, 0,-1,-1, 0,-1],
        [-1, 0, 0, 0,-1, 2, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "10: Espiral", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1, 0,-1,-1,-1,-1, 0,-1],
        [-1, 0,-1, 2, 0,-1, 0,-1],
        [-1, 0,-1, 1, 0,-1, 0,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "11: Simetria", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0,-1, 0, 2,-1],
        [-1, 0,-1, 0, 0, 0,-1,-1],
        [-1, 0, 0, 0,-1, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "12: Caos", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0,-1, 2, 0, 0,-1],
        [-1, 0, 0, 0, 0,-1, 0,-1],
        [-1,-1, 0,-1, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]},
    { name: "13: Desafio Final", map: [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1, 1, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1, 0,-1,-1,-1],
        [-1, 2, 0, 0, 0, 0, 0,-1],
        [-1, 0,-1,-1,-1,-1, 0,-1],
        [-1, 0, 0, 0, 0, 0, 0,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
    ]}
];

let currentLevel = 0;
let player = { x: 0, y: 0 };
let moveCount = 0;
let grid = [];

function loadLevel(idx) {
    if(idx >= levels.length) {
        alert("🎉 Incrível! Você dominou todos os níveis!");
        currentLevel = 0;
        idx = 0;
    }
    const lvl = levels[idx];
    document.getElementById('lvlName').innerText = lvl.name;
    grid = JSON.parse(JSON.stringify(lvl.map));
    moveCount = 0;
    document.getElementById('moves').innerText = moveCount;

    for(let y=0; y<grid.length; y++) {
        for(let x=0; x<grid[y].length; x++) {
            if(grid[y][x] === 1) player = {x, y};
        }
    }
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const px = x * TILE; const py = y * TILE;
            
            if(cell === -1) { 
                ctx.fillStyle = "#1e293b";
                ctx.fillRect(px, py, TILE, TILE);
                ctx.strokeStyle = "#334155";
                ctx.strokeRect(px+2, py+2, TILE-4, TILE-4);
            } else if(cell === 1) { 
                drawNeonRect(px+10, py+10, TILE-20, "#00d2ff");
            } else if(cell === 2) { 
                drawNeonCircle(px+TILE/2, py+TILE/2, 12, "#4ecca3");
            }
        });
    });
}

function drawNeonRect(x, y, size, color) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawNeonCircle(x, y, rad, color) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

window.addEventListener('keydown', (e) => {
    let nx = player.x, ny = player.y;
    if(e.key === "ArrowUp") ny--;
    if(e.key === "ArrowDown") ny++;
    if(e.key === "ArrowLeft") nx--;
    if(e.key === "ArrowRight") nx++;

    if(grid[ny] && grid[ny][nx] !== undefined && grid[ny][nx] !== -1) {
        if(grid[ny][nx] === 2) {
            currentLevel++;
            setTimeout(() => loadLevel(currentLevel), 100);
            return;
        }
        grid[player.y][player.x] = 0;
        player = {x: nx, y: ny};
        grid[player.y][player.x] = 1;
        moveCount++;
        document.getElementById('moves').innerText = moveCount;
        draw();
    }
});

loadLevel(currentLevel);
function loadLevel(idx) {
    if(idx >= levels.length) {
        alert("🎉 Incrível! Você dominou todos os níveis!");
        currentLevel = 0;
        idx = 0;
    }
    
    const lvl = levels[idx];
    document.getElementById('lvlName').innerText = lvl.name;
    grid = JSON.parse(JSON.stringify(lvl.map));
    moveCount = 0;
    document.getElementById('moves').innerText = moveCount;

    // --- AJUSTE DINÂMICO DE TAMANHO ---
    // Define a largura baseada no número de colunas
    canvas.width = grid[0].length * TILE;
    // Define a altura baseada no número de linhas
    canvas.height = grid.length * TILE;

    for(let y=0; y<grid.length; y++) {
        for(let x=0; x<grid[y].length; x++) {
            if(grid[y][x] === 1) player = {x, y};
        }
    }
    draw();
}
// Exemplo de lógica opcional dentro do loadLevel:
if (grid[0].length > 10) {
    // Se a fase for larga, diminui o tamanho do bloco para caber na tela
    // TILE = 40; 
}
