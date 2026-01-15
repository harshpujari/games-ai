const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    color: '#fff',
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: '#fff',
    dx: 5,
    dy: -5
};

let score = 0;

const bricks = [];
const brickInfo = {
    width: 75,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    color: '#fff'
};

// Create bricks
for (let c = 0; c < 5; c++) {
    bricks[c] = [];
    for (let r = 0; r < 3; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Draw functions
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offsetX;
                const brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offsetY;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickInfo.width, brickInfo.height);
                ctx.fillStyle = brickInfo.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    drawScore();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

// Keyboard event handlers
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = 8;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -8;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left/right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    } else if (ball.y + ball.radius > canvas.height) {
        alert('GAME OVER');
        document.location.reload();
    }

    // Paddle collision
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
    ) {
        ball.dy *= -1;
    }
}

function collisionDetection() {
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickInfo.width &&
                    ball.y > b.y &&
                    ball.y < b.y + brickInfo.height
                ) {
                    ball.dy *= -1;
                    b.status = 0;
                    score++;
                    if (score === 5 * 3) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}


// Game loop
function update() {
    movePaddle();
    moveBall();
    collisionDetection();
    draw();
    requestAnimationFrame(update);
}

update();
