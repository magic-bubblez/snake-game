const gameBoard = document.getElementById("gameBoard");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("startButton");
const upButton = document.getElementById("up-button");
const downButton = document.getElementById("down-button");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

const gameOver = new Audio("game-over2.mp3");
const gameBegins = new Audio("snake-game.mp3");

const GRID_SIZE = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = "right";
let score = 0;
let gameInterval;
let gameSpeed = 200;
let isGameRunning = false;
let blinkInterval;

function draw() {
	gameBoard.innerHTML = "";
	snake.forEach((segment) => {
		const snakeElement = document.createElement("div");
		snakeElement.style.gridRowStart = segment.y;
		snakeElement.style.gridColumnStart = segment.x;
		snakeElement.classList.add("snake");
		gameBoard.appendChild(snakeElement);
	});

	const foodElement = document.createElement("div");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	foodElement.classList.add("food");
	gameBoard.appendChild(foodElement);
}

function generateFood() {
	food = {
		x: Math.floor(Math.random() * GRID_SIZE) + 1,
		y: Math.floor(Math.random() * GRID_SIZE) + 1,
	};
}

function move() {
	if (!isGameRunning) return;

	const head = { x: snake[0].x, y: snake[0].y };

	switch (direction) {
		case "up":
			head.y--;
			break;
		case "down":
			head.y++;
			break;
		case "left":
			head.x--;
			break;
		case "right":
			head.x++;
			break;
	}

	// Wall collision
	if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
		endGame();
		return;
	}

	// Self-collision
	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x && head.y === snake[i].y) {
			endGame();
			return;
		}
	}

	snake.unshift(head);

	if (head.x === food.x && head.y === food.y) {
		score += 10;
		scoreBoard.textContent = `Score: ${score}`;
		generateFood();
		// Increase speed
		gameSpeed = Math.max(50, gameSpeed - 10);
		clearInterval(gameInterval);
		gameInterval = setInterval(gameLoop, gameSpeed);
	} else {
		snake.pop();
	}

	draw();
}

function changeDirection(newDirection) {
	if (
		(newDirection === "up" && direction === "down") ||
		(newDirection === "down" && direction === "up") ||
		(newDirection === "left" && direction === "right") ||
		(newDirection === "right" && direction === "left")
	) {
		return;
	}
	direction = newDirection;
}

function handleKeyPress(event) {
	if (!isGameRunning && event.key !== " ") return; // Allow space to start game

	switch (event.key) {
		case "ArrowUp":
		case "w":
		case "W":
			changeDirection("up");
			break;
		case "ArrowDown":
		case "s":
		case "S":
			changeDirection("down");
			break;
		case "ArrowLeft":
		case "a":
		case "A":
			changeDirection("left");
			break;
		case "ArrowRight":
		case "d":
		case "D":
			changeDirection("right");
			break;
		case " ":
			if (!isGameRunning) startGame();
			break;
	}
}

function gameLoop() {
	move();
}

function startGame() {
	isGameRunning = true;
	startButton.textContent = "Restart Game";
	snake = [{ x: 10, y: 10 }];
	direction = "right";
	score = 0;
	scoreBoard.textContent = `Score: ${score}`;
	gameSpeed = 200;

	// Clear any game over message
	if (blinkInterval) {
		clearInterval(blinkInterval);
		blinkInterval = null;
	}

	generateFood();
	draw();
	clearInterval(gameInterval);
	gameInterval = setInterval(gameLoop, gameSpeed);

	// Stop game over sound if it's playing
	gameOver.pause();
	gameOver.currentTime = 0;

	// Play game start sound
	gameBegins.currentTime = 0;
	gameBegins.play();
}

function endGame() {
	isGameRunning = false;
	clearInterval(gameInterval);

	// Stop and reset game begin sound
	gameBegins.pause();
	gameBegins.currentTime = 0;

	// Reset and play game over sound
	gameOver.currentTime = 0;
	gameOver.play();

	startButton.textContent = "Start Game";

	// Display "GAME OVER!!" with blinking effect
	displayGameOver();
}

function displayGameOver() {
	let isVisible = true;
	const gameOverDiv = document.createElement("div");
	gameOverDiv.style.position = "absolute";
	gameOverDiv.style.top = "50%";
	gameOverDiv.style.left = "50%";
	gameOverDiv.style.transform = "translate(-50%, -50%)";
	gameOverDiv.style.fontSize = "2em";
	gameOverDiv.style.fontWeight = "bold";
	gameOverDiv.style.color = "white";
	gameOverDiv.style.textShadow = "2px 2px 4px black";
	gameOverDiv.textContent = "GAME OVER!!";
	gameOverDiv.style.zIndex = "10";

	// Position relative to game board
	gameBoard.style.position = "relative";
	gameBoard.appendChild(gameOverDiv);

	// Blink effect
	blinkInterval = setInterval(() => {
		gameOverDiv.style.visibility = isVisible ? "visible" : "hidden";
		isVisible = !isVisible;
	}, 300);

	// Stop blinking after 3 seconds and keep it visible
	setTimeout(() => {
		clearInterval(blinkInterval);
		gameOverDiv.style.visibility = "visible";
	}, 3000);
}

document.addEventListener("keydown", handleKeyPress);
startButton.addEventListener("click", () => {
	if (isGameRunning) {
		endGame();
	} else {
		startGame();
	}
});

// Add event listeners for mobile controls
upButton.addEventListener("click", () => changeDirection("up"));
downButton.addEventListener("click", () => changeDirection("down"));
leftButton.addEventListener("click", () => changeDirection("left"));
rightButton.addEventListener("click", () => changeDirection("right"));

// Initial draw
draw();
