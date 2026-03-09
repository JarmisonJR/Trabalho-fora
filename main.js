// Referências aos elementos do HTML
const canvas = document.getElementById('gameCanvas');
const levelLabel = document.getElementById('level-title');
const moveLabel = document.getElementById('move-count');

// Inicialização das classes que criamos antes
const engine = new GameEngine();
const renderer = new Renderer('gameCanvas');

let currentLevelData = null;
let playerPos = { x: 0, y: 0 };
let moves = 0;

// Função para carregar uma fase
async function loadLevel(levelId) {
    // Aqui simulamos o carregamento do JSON
    const response = await fetch('src/levels/data.json');
    const data = await response.json();
    currentLevelData = data.levels.find(l => l.id === levelId);

    if (currentLevelData) {
        levelLabel.innerText = currentLevelData.title;
        moves = 0;
        updateUI();
        
        // Achar posição inicial do jogador (onde está o número 1 na matriz)
        currentLevelData.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) playerPos = { x, y };
            });
        });

        renderer.drawGrid(currentLevelData.grid);
    }
}

// Lógica de Movimentação
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Verificar se está dentro dos limites da grade
    if (newY >= 0 && newY < currentLevelData.grid.length &&
        newX >= 0 && newX < currentLevelData.grid[0].length) {
        
        const targetCell = currentLevelData.grid[newY][newX];

        // Se não for parede (supondo que parede seja -1)
        if (targetCell !== -1) {
            // Limpa posição antiga na matriz e define a nova
            currentLevelData.grid[playerPos.y][playerPos.x] = 0;
            playerPos = { x: newX, y: newY };
            
            // Verifica se chegou no objetivo (número 2)
            if (targetCell === 2) {
                alert("Parabéns! Fase Concluída!");
                engine.saveProgress(currentLevelData.id + 1);
                loadLevel(currentLevelData.id + 1);
                return;
            }

            currentLevelData.grid[playerPos.y][playerPos.x] = 1;
            moves++;
            updateUI();
            renderer.drawGrid(currentLevelData.grid);
        }
    }
}

function updateUI() {
    moveLabel.innerText = moves;
}

// Captura de Teclas
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':    movePlayer(0, -1); break;
        case 'ArrowDown':  movePlayer(0, 1);  break;
        case 'ArrowLeft':  movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0);  break;
    }
});

// Iniciar o jogo
loadLevel(engine.currentLevelIndex);
