class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.tileSize = 64;
  }

drawGrid(matrix) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      this.drawTile(x, y, cell);
    });
  });
}

drawTile(x, y, type) {
  const posX = x * this.tileSize;
  const posY = y * this.tileSize;

  //Estilização "Clean Design"
  this.ctx.strokeStyle = "#dfe6e9";
  this.ctx.strokeRect(posX, posY, this.tileSize, this.tileSize);

  if (type === 1) { // Jogador
    this.ctx.fillStyle = "#0984e3"; //Azul vibrante
    this.drawRoundRect(posX + 5, posY + 5, this.tileSize - 10, this.tileSize -10, 10);
  } else if (type === 2) { //Objetivo
    this.ctx.fillStyle = "#00b894"; //Verde vitória
    this.ctx.beginPath();
    this.ctx.arc(posX + 32, posY + 32, 15, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

//Função auxiliar para deixar o visual "Premium" com cantos arredondados
drawRoundedRect(x, y, w, h, r) { 
  this.ctx.beginPath();
  this.ctx.roundRect(x, y, w, h, r);
  this.ctx.fill();
}
}
