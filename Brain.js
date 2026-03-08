class GameEngine {
  constructor() {
    this.currentLevelIndex = this.loadProgress();
    this.movesMade = 0;
    this.isGameOver = false;
  }
  //Salva o progresso para que o jogador não perca as fases desbloqueadas
saveProgress(levelId) {
  const reachedLevel = localStorage.getItem('puzzle_reached_level') || 1;
  if (levelId > reachedLevel) {
    localStorage.setItem('puzzle_reached_level', levelId);
  }
}

loadProgress() {
  return parseInt(localStorage.getItem('puzzle_reached_level')) || 1;
}

checkWinCondition(playerPos, targetPos) {
  if (playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
    console.log("🏆Fase Concluída!");
    this.saveProgress(this.currentLevelIndex + 1);
    return true;
  }
  return false;
}
}
