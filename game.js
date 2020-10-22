// Get Context
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

// Define Canvas Dimension
canvas.width = 1000;
canvas.height = 500;

// Game Logic Variables
let gameOver = false;
let gamePause  = false;
let leftPressed = false;
let rightPressed = false;

// Mics Functions
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Ball Object
let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  velocity: {
    x:  7.5,
    y: -7.5,
  },
  radius: 10,
  color: 'blue',
}

// Draw Ball
function drawBall(ball) {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  context.fillStyle = ball.color;
  context.fill();
  context.closePath();

  if (ball.x + ball.velocity.x > canvas.width - ball.radius || ball.x + ball.velocity.x < ball.radius) {
    ball.velocity.x = -ball.velocity.x;
    ball.color = getRandomColor();
  }

  if (ball.y + ball.velocity.y < ball.radius) {
    ball.velocity.y = -ball.velocity.y;
    ball.color = getRandomColor();
  } else if (ball.y + ball.radius > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    ball.velocity.y = -ball.velocity.y;
    ball.color = getRandomColor();
    paddle.color = getRandomColor();
  } else if (ball.y + ball.velocity.y > canvas.height - ball.radius) {
      gameOver = true;

  }

  ball.x += ball.velocity.x;
  ball.y += ball.velocity.y;

}

// Paddle Object
let paddle = {
  height: 20,
  width: 150,
  x: (canvas.width - 150) / 2,
  color: getRandomColor()
}

// Draw Paddle
function drawPaddle(paddle) {
  context.beginPath();
  context.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
  context.fillStyle = paddle.color;
  context.fill();
  context.closePath();

  if (leftPressed) {
    paddle.x -= 10;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  } else if (rightPressed) {
    paddle.x += 10;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
}

// Bricks property
let brick = {
  rowCount: 3,
  columnCount: 8,
  width: 100,
  height: 25,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 60,
}

// Create Bricks
let bricks = [];
for (let x = 0; x < brick.columnCount; x++) {
  bricks[x] = [];
  for (let y = 0; y < brick.rowCount; y++) {
    bricks[x][y] = { x: 0, y: 0, alive: 1, color:getRandomColor() };
  }
}

function drawBricks() {
  for (let x = 0; x < brick.columnCount; x++) {
    for (let y = 0; y < brick.rowCount; y++) {
      if (bricks[x][y].alive) {
        brickX = x*(brick.width + brick.padding) + brick.offsetLeft;
        brickY = y*(brick.height + brick.padding) + brick.offsetTop;
        bricks[x][y].x = brickX;
        bricks[x][y].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brick.width, brick.height);
        context.fillStyle = bricks[x][y].color;
        context.fill();
        context.closePath();
      }
      
    }
  }
}

// Brick Collision Detection
function brickCollisionCalculate() {
  for (let x = 0; x < brick.columnCount; x ++) {
    for (let y = 0; y < brick.rowCount; y++) {
      let b = bricks[x][y];
      if (ball.x > b.x && ball.x < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
        if (b.alive) {
          ball.velocity.y = -ball.velocity.y;
          ball.color = getRandomColor();
          bricks[x][y].alive = 0
        }
      }
    }
  }
}

function resetGame(event) {
  if (event.key === "r") {
    document.location.reload();
  }
}

// Add Event Listner
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", resetGame, false);

function keyDownHandler(event) {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = true;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = false;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function drawGameOver(state) {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  if (state) { // True means loose otherwise win
    context.fillStyle = "red";
  } else {
    context.fillStyle = "green";
  }
  context.fill();
  context.font = "30px Arial";
  context.fillStyle = "black";
  context.fillText("Game Over",(canvas.width/2)-80, canvas.height/2);
  context.fillText("Press r to reset",(canvas.width/2)-100, (canvas.height/2)+40);
  context.closePath();
}

let count = 0;

// Draw Our Game
function draw() {
  // Count Left
  count = 0;
  for (x = 0; x < brick.columnCount; x++) {
    for (y = 0; y < brick.rowCount; y++) {
      if (bricks[x][y].alive) {
        count += 1;
      }
    }
  }
  // Game Logic
  if (gameOver) {
    drawGameOver(true);
    //alert("Game Over");
    //document.location.reload();
    //clearInterval(interval);
  } else if (count === 0 ) {
    drawGameOver(false);
    //clearInterval(interval);
  } else {
    // Draw Left
    context.font = "16px Arial";
    context.fillStyle = "black";
    context.fillText("Left: " + count,8, 20);
    
    // Draw
    context.clearRect(0,0,canvas.width, canvas.height);
    drawBall(ball);
    drawPaddle(paddle);
    drawBricks();
    brickCollisionCalculate();

    requestAnimationFrame(draw);
  }
  
}

// Define Game Loop
//let interval = setInterval(draw, 10);
draw();