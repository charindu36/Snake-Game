const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let gameRunning = true;
let paused = false;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let frame = 0;
let Speed = 10;

function animate() {
  requestAnimationFrame(animate);

  if (paused || !gameRunning) return;

  if (++frame % Speed !== 0) return;

  if (gameRunning) {
    update();
  }
  draw();
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Game Over Conditions
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameRunning = false;
    if (!gameRunning) gameOverSound.play();
    return;
  }

  snake.unshift(head);

  // Eating food
  if (head.x === food.x && head.y === food.y) {
    eatSound.play();
    score++;
    food = generateFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "#0f0";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Food
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );

  // Score
  ctx.fillStyle = "#0f0";
  ctx.font = "16px monospace";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);

  // Game Over Overlay
  if (!gameRunning) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f00";
    ctx.font = "28px monospace";
    ctx.fillText("GAME OVER!", canvas.width / 2 - 85, canvas.height / 2 - 10);

    ctx.fillStyle = "#0f0";
    ctx.font = "18px monospace";
    ctx.fillText(
      "Press Enter to Restart",
      canvas.width / 2 - 110,
      canvas.height / 2 + 20
    );
  }
}

function generateFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
    if (!isOnSnake) break;
  }
  return newFood;
}

function restartGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  food = generateFood();
  gameRunning = true;
}

// Controls
document.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "p" || e.key === "P" || e.code === "Space") {
    paused = !paused;
    return;
  }

  if (!gameRunning && e.key === "Enter") {
    console.log("restarting game");
    restartGame();
    return;
  }
  //speed
  if (e.key === "+") {
    Speed = Math.max(1, Speed - 1);
  } else if (e.key === "-") {
    Speed += 1;
  }
  if (gameRunning) {
    switch (e.key) {
      case "ArrowLeft":
        if (dx === 0) {
          dx = -1;
          dy = 0;
        }
        break;
      case "ArrowUp":
        if (dy === 0) {
          dx = 0;
          dy = -1;
        }
        break;
      case "ArrowRight":
        if (dx === 0) {
          dx = 1;
          dy = 0;
        }
        break;
      case "ArrowDown":
        if (dy === 0) {
          dx = 0;
          dy = 1;
        }
        break;
    }
  }
  if (gameRunning) {
    switch (e.key.toLowerCase()) {
      case "a":
        if (dx === 0) {
          dx = -1;
          dy = 0;
        }
        break;
      case "z":
        if (dy === 0) {
          dx = 0;
          dy = 1;
        }
        break;
      case "d":
        if (dx === 0) {
          dx = 1;
          dy = 0;
        }
        break;
      case "s":
        if (dy === 0) {
          dx = 0;
          dy = -1;
        }
        break;
    }
  }
});

animate();
