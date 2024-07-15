let ballPosition = {
  x: 50,
  y: 80,
  vy: 0,
  isJumping: false,
};
let ballSpeed = 3; // Adjust as needed
const gravity = 1; // Gravity effect
const jumpPower = 24.5; // Jump strength

// Points variables
const basePointIntervalTime = 2000; // Base interval between points spawning (ms)
let pointIntervalTime = basePointIntervalTime; // Interval between points spawning (ms)
let pointInterval = null;
const pointLifeTime = 3000; // Points disappear after 3 seconds

// Movement flags
let moveLeft = false;
let moveRight = false;

// Initialize score
let score = 0;
const scoreDisplay = document.getElementById("score");

// Upgrade variables
let speedUpgradesPurchased = 0;
let pointsUpgradesPurchased = 0;
const maxSpeedUpgrades = 5;
const maxPointsUpgrades = 5;
let speedUpgradeCost = 10;
let pointsUpgradeCost = 100;
let speedMultiplier = 1;

// Game state
let gamePaused = false;

// DOM elements
const ball = document.getElementById("ball");
const pointsContainer = document.getElementById("points-container");
const pauseResumeButton = document.getElementById("pause-resume-button");
const menuIcon = document.getElementById("menu-icon");
const shopButton = document.getElementById("shop-button");
const helpButton = document.getElementById("help-button");
const settingsButton = document.getElementById("settings-button");
const shopModal = document.getElementById("shop-modal");
const helpModal = document.getElementById("help-modal");
const settingsModal = document.getElementById("settings-modal");
const closeButtons = document.querySelectorAll(".close-button");
const buySpeedUpgradeButton = document.getElementById(
  "buy-speed-upgrade-button"
);
const buyPointsUpgradeButton = document.getElementById(
  "buy-points-upgrade-button"
);
const speedUpgradeCostSpan = document.getElementById("speed-upgrade-cost");
const pointsUpgradeCostSpan = document.getElementById("points-upgrade-cost");

// Joystick elements
const joystickBase = document.getElementById("joystick-base");
const joystickHandle = document.getElementById("joystick-handle");

// Function to handle buying speed upgrade
function buySpeedUpgrade() {
  if (score >= speedUpgradeCost) {
    speedUpgradesPurchased++;
    score -= speedUpgradeCost;
    speedUpgradeCost *= 2;
    updateScoreDisplay();
    updateUpgradeCostDisplay();
    updateBallSpeed();
  }
}

// Function to handle buying points upgrade
function buyPointsUpgrade() {
  if (score >= pointsUpgradeCost) {
    pointsUpgradesPurchased++;
    score -= pointsUpgradeCost;
    pointsUpgradeCost *= 2;
    updateScoreDisplay();
    updateUpgradeCostDisplay();
  }
}

// Function to update score display
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Function to update upgrade cost display
function updateUpgradeCostDisplay() {
  speedUpgradeCostSpan.textContent = speedUpgradeCost;
  pointsUpgradeCostSpan.textContent = pointsUpgradeCost;
}

// Function to update ball speed based on upgrades purchased
function updateBallSpeed() {
  const adjustedSpeed = ballSpeed + speedUpgradesPurchased * 0.5;
  ballSpeed = adjustedSpeed;
}

// Function to handle ball movement
function moveBall() {
  if (!gamePaused) {
    if (moveLeft) {
      ballPosition.x -= ballSpeed;
    }
    if (moveRight) {
      ballPosition.x += ballSpeed;
    }

    // Apply gravity and update position
    ballPosition.vy += gravity;
    ballPosition.y += ballPosition.vy;

    // Adjust ball position
    if (ballPosition.y > 280) {
      ballPosition.y = 280;
      ballPosition.vy = 0;
      ballPosition.isJumping = false;
    }

    // Update ball position
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    // Check for collision with points
    checkPointCollision();

    // Check for game over conditions
    checkGameOver();

    // Request animation frame
    requestAnimationFrame(moveBall);
  }
}

// Function to start the game
function startGame() {
  moveBall();
  startSpawningPoints();
}

// Function to pause or resume the game
function pauseResumeGame() {
  gamePaused = !gamePaused;
  pauseResumeButton.textContent = gamePaused ? "Resume" : "Pause";
}

// Function to start spawning points
function startSpawningPoints() {
  pointInterval = setInterval(spawnPoint, pointIntervalTime);
}

// Function to stop spawning points
function stopSpawningPoints() {
  clearInterval(pointInterval);
}

// Function to spawn a point
function spawnPoint() {
  const point = document.createElement("div");
  point.className = "point";
  const randomX = Math.floor(Math.random() * 360) + 20; // Random x position within game container
  point.style.left = `${randomX}px`;
  pointsContainer.appendChild(point);

  // Remove point after specified time
  setTimeout(() => {
    point.remove();
  }, pointLifeTime);
}

// Function to check collision with points
function checkPointCollision() {
  const points = document.querySelectorAll(".point");
  points.forEach((point) => {
    if (isCollision(ball, point)) {
      point.remove();
      score++;
      updateScoreDisplay();
    }
  });
}

// Function to check for collision between two elements
function isCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
}

// Function to check game over conditions
function checkGameOver() {
  // Placeholder for game over logic
}

// Event listeners
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    moveLeft = true;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    moveRight = true;
  } else if (event.key === "ArrowUp" || event.key === "w") {
    if (!ballPosition.isJumping) {
      ballPosition.vy = -jumpPower;
      ballPosition.isJumping = true;
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "a") {
    moveLeft = false;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    moveRight = false;
  }
});

menuIcon.addEventListener("click", () => {
  shopModal.style.display = "none";
  helpModal.style.display = "none";
  settingsModal.style.display = "none";
});

shopButton.addEventListener("click", () => {
  shopModal.style.display = "block";
});

helpButton.addEventListener("click", () => {
  helpModal.style.display = "block";
});

settingsButton.addEventListener("click", () => {
  settingsModal.style.display = "block";
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    shopModal.style.display = "none";
    helpModal.style.display = "none";
    settingsModal.style.display = "none";
  });
});

buySpeedUpgradeButton.addEventListener("click", buySpeedUpgrade);
buyPointsUpgradeButton.addEventListener("click", buyPointsUpgrade);

// Apply custom settings function
function applyCustomSettings() {
  const borderColorInput = document.getElementById("border-color-input").value;
  const borderWidthInput = document.getElementById("border-width-input").value;
  const gradientColorInput = document.getElementById("bg-gradient-start").value;
  const gradientColorEndInput =
    document.getElementById("bg-gradient-end").value;

  const gameContainer = document.getElementById("game-container");
  gameContainer.style.border = `${borderWidthInput}px solid ${borderColorInput}`;
  document.body.style.background = `linear-gradient(to right, ${gradientColorInput}, ${gradientColorEndInput})`;
}

// Event listener for apply button
const applyButton = document.getElementById("apply-button");
applyButton.addEventListener("click", applyCustomSettings);

// Initialize the game
updateScoreDisplay();
updateUpgradeCostDisplay();
startGame();

// Example: Adjusting event listeners for touch events
window.addEventListener("touchstart", handleTouchStart, false);
window.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(event) {
    // Handle touch start events
}

function handleTouchEnd(event) {
    // Handle touch end events
}
