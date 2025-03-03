//when making a game always initialize the canvas first 

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//grid and canvas settings
const gridSize = 20;
const canvasSize = 800;
canvas.width = canvasSize;
canvas.height = canvasSize;


//load in  array for the images and for the planets(snake)
const planetImgs = [
    new Image(),  // planet1
    new Image(),  // planet 2
    new Image(),  //3...
    new Image()   
];

planetImgs[0].src = "planet1.png";  // source for all planet images 

planetImgs[1].src = "planet2.png";  

planetImgs[2].src = "planet3.png";  

planetImgs[3].src = "planet4.png";  


const starImg = new Image();

starImg.src = "star.png";  // star image = snake food

const cometImg = new Image();

cometImg.src = "comet.png";  //comet = power ups 

const heartImg = new Image();

heartImg.src = "heart.png";  // heart = extra life



//once the game starts it makes sense for the snake to start going right
    let direction = "RIGHT";

    let food = spawnFood();

    let powerUp = spawnFood(); // comet = food = power up food 

    let extraLife = spawnFood(); // heart = food = extra life

    let lives = 3; //base lives of 3 

    let score = 0; //base score of 0 
    
    let snake = [{ x: 400, y: 400 }];
    let snakeSizeMultiplier = 1; // Variable to track the snake's size multiplier

//event listener for movement of the keys , this way when they are clicked there is a response in the html 
window.addEventListener("keydown", (e) => {
   
    const keyMap = { 
        
        ArrowLeft: "LEFT", 
       
        ArrowUp: "UP", 
       
        ArrowRight: "RIGHT", 
       
        ArrowDown: "DOWN" 
         };
   
         if (keyMap[e.key]) direction = keyMap[e.key];
   
});

//this pauses the game and waits for all images to load until starting the game                    // maybe i can add some sort of reset button for those who want to restart mid  game
let imagesLoaded = 0;
const images = [...planetImgs, starImg, cometImg, heartImg];

images.forEach((img) => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            gameLoop();  // starts the game loop but only if all images are properly loaded in 
                 }
         };
    });

// main loop for the game , updates the entire games state and handles movement, collision etc. also updates position of food and everything in between.
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 150);
}

//updates the game state and handles movement, collision etc. also updates position of food and everything in between.
function update() {
    let head = { ...snake[0] };
    
    if (direction === "LEFT") head.x -= gridSize; // this is for the movement of the snake , does this by subtracting or adding the grid size to the x or y coordinates of the head of the snake
    
    if (direction === "RIGHT") head.x += gridSize;
    
    if (direction === "UP") head.y -= gridSize;
    
    if (direction === "DOWN") head.y += gridSize;

    //this is for bouncing mechanics and without this , wouldnt be able to tell when the snake (planets) die / lose
    if (head.x < 0) head.x = canvasSize - gridSize;
   
    if (head.x >= canvasSize) head.x = 0;
    
    if (head.y < 0) head.y = canvasSize - gridSize;
    
    if (head.y >= canvasSize) head.y = 0;

    
    // to tell us when there is a collision and to signify it in the console and on page. 
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        lives--;
        if (lives <= 0) {
            alert("Game Over!");
            document.location.reload(); // if lives = 0 then we restart the game
        }
        return;
    }

    snake.unshift(head);

    // this is for when food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = spawnFood();
    } else {
        snake.pop(); //this removes our tail if no food has been eaten 
    }

    // for collecting power ups 
    if (head.x === powerUp.x && head.y === powerUp.y) {
        score += 20;
        snakeSizeMultiplier += 0.5; // increases size of snake (by increasing multiplier)
        powerUp = spawnFood();
    }

    // for collecting extra life 
    if (head.x === extraLife.x && head.y === extraLife.y) {
        lives++;
        extraLife = spawnFood();
    }
}

function draw() {
    // now for the space background 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // space effect of mini stars 
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(
            Math.random() * canvasSize,
            Math.random() * canvasSize,
            1,
            1
        );
    }

    //this is for drawing the planet as teh snake with random planet generator... 
    snake.forEach((segment, index) => {
        
        
        // different planet image for each segment of the snake
        
        const planetImage = planetImgs[index % planetImgs.length]; // iterate through the planets
       
        const planetSize = gridSize * snakeSizeMultiplier; // Increase size of planet as snake grows
       
        ctx.drawImage(planetImage, segment.x, segment.y, planetSize, planetSize);
    
    });

   
    //draws the stars as food 
    
    ctx.drawImage(starImg, food.x, food.y, gridSize, gridSize);

    
    // draws the comet as a power up
    ctx.drawImage(cometImg, powerUp.x, powerUp.y, gridSize, gridSize);

    
    //draws the heart as an extra life 
    ctx.drawImage(heartImg, extraLife.x, extraLife.y, gridSize, gridSize);

   
    // for the font of score and lives textg
    ctx.fillStyle = "white";
    
    ctx.font = "16px Arial";
   
    ctx.fillText(`Score: ${score}  Lives: ${lives}`, 10, 20);
}

//generates new food at a random position on the grid
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
}
