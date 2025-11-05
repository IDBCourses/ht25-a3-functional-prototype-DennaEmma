/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// State variables are the parts of your program that change over time.
//Game state veriables


let prevKey = null; //tracks the previously pressed key
let currKey = null; //tracks the currently pressed key
let timeoutID = null; //stores a timer that resets key presses after a short delay
let ballsCollected = 0;
let lives = 4; // Player starts with 5 lives
let spawnTimer = null; // Timer for spawning balls

//Player properties
let size = 100;
let X = (window.innerWidth - size)/2; // Initial horizontal position
let targetX = X; // Target horizontal position for smooth movement
let Y = (window.innerHeight - size)/1.2;  // Vertical position near bottom of screen
let colours = [0, 120, 240]; // Diffrent colours for the balls
let playerColourIndex =0; // Current colour index of player
let balls = [];

// Settings variables should contain all of the "fixed" parts of your programs

const spawnInterval = 2000; //milliseconds between ball spawns
const step = 60; //number of pixels to move per swipe
const smoothSpeed = 0.1; //speed of smooth movement

// Keys that represent a row on the keyboard 
const row = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyÖ', 'KeyÄ']



function spawnBall(){
  const colourIndex = Math.floor(Math.random() * colours.length);
  const x = Math.random() * (window.innerWidth - size);
  const el = Util.createThing(null, "thing");
  balls.push({ x, y: -size, colourIndex, speed: 3 + Math.random() * 2, el})
}

// Movement of the player 
function swipeDirection(){
  let prevIndex = row.indexOf(prevKey);// Find the index of the previous key in the row array
  let currIndex = row.indexOf(currKey);// Find the index of the current key in the row array

  console.log(`${prevIndex} -> ${currIndex}`);

  if( currIndex < 0 || prevIndex < 0){
    return 0; // if either key is not in the row, return 0
  } else {
    let dIndex = currIndex - prevIndex; //

    if(dIndex > 1 || dIndex < -1){
      return 0; // if the keys are not adjacent, return 0 (ignore large jumps)
    } else {
      return dIndex; // return the direction: -1 for left, 1 for right
    }
  }
}



// Resets the key presses after a short time and loggs it.
function resetKeys(){
  prevKey = null;
  currKey = null;

  console.log('Reset key presses.');
}

function showGameOverSign(){
  const overlay = document.createElement("div");
  overlay.id = "gameOverOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "10%";
  overlay.style.left = "10%";
  overlay.style.right= "10%";
  overlay.style.bottom = "10%";
  overlay.style.backgroundColor = "#c71622aa";
  overlay.style.display = "flex";
  overlay.style.padding = "100px";
  overlay.style.justifyContent = "center";
  overlay.style.fontsize = "30px";
  overlay.style.color = "#efe8e8aa"
  overlay.style.fontFamily = "'Courier New', Courier, monospace";
  overlay.style.zIndex = "999"; // So overlay stays on top
  overlay.style.borderRadius = "30px";

  const message = document.createElement("div");
  message.textContent = "Game Over! You collected: " + ballsCollected + " balls.";
  message.style.textAlign = "50px";
  message.style.fontSize = "35px";
  message.style.top = "5px";
  overlay.appendChild(message);


  // Create a restart button
  let restartButton = document.createElement("button"); // Create a button element
  restartButton.textContent = "Try again"; // Set the button text
  restartButton.style.position = "absolute"; // Position it anywhere on the page
  restartButton.style.top = "50%"; // Place it 50% from the top
  restartButton.style.left = "50%"; // Place it 50% from the left (center)
  restartButton.style.transform = "translate(-50%, -50%)"; // Center the button perfectly
  restartButton.style.padding = "10px 20px"; // Add space inside the button
  restartButton.style.fontSize = "30px"; // Make the text bigger
  restartButton.style.border = "5px"; // Remove the border
  restartButton.style.borderRadius = "10px"; // Round the corners
  restartButton.style.backgroundColor = "#d9a2cfaa"; // Make it light green
  restartButton.style.cursor = "pointer"; // Show pointer cursor when hovering
  restartButton.style.fontFamily = "'comic sans ms', 'comic sans', cursive";

  restartButton.addEventListener('click', ()=>{
    // Restarts the game
    Overlay.remove();
    restartGame();
 });

 overlay.appendChild(restartButton); // Adds restart button to overlay
 document.body.appendChild(overlay); // Adds overlay to the document body
}



function endGame(){
  clearInterval(spawnTimer);
  balls.forEach(b => b.el.remove()); // Remove all ball elements from DOM
  balls = []; // Clear the ball array
  console.log(`Game Over! Total Balls Collected: ${ballsCollected}`);

  showGameOverSign();
}



function restartGame(){
  // Resets game state
  ballsCollected = 0;
  lives = 4;
  balls = [];
  X = (window.innerWidth - size)/2;
  targetX = X;
  playerColourIndex = 0;

  // Restart spawning balls and the main loop
  spawnTimer = setInterval(spawnBall(), spawnInterval);
  window.requestAnimationFrame(loop);
}





// Code that runs over and over again
function loop() {
  // Player updates
  Util.setPositionPixels(X, Y);
  Util.setSize(size);
  Util.setColour(colours[playerColourIndex], 100, 50);
  
  // smooth player movement
  X += ( targetX - X) * smoothSpeed; // Smoothly interpolate X towards targetX)
  X = Math.max(0, Math.min(X, window.innerWidth - size)); // Clamp X within window bounds

  // Update falling balls
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    b.y += b.speed;
  
    if (!b.el) continue; // skips missing elements


  //Check for collisions 
  let dx = Math.abs(b.x - X); // Horizontal distance between ball and player
  let dy = Math.abs(b.y - Y); // Vertical distence bbetween ball and player

  if( dx < size / 2 && dy < size /1.2){ // Collision detected
    if (b.colourIndex === playerColourIndex){ // Checks if colours match
      // Correct colour: remove ball
      b.el.remove(); // Remove ball element from DOM (becomes to crouded otherwise)
      balls.splice(i,1);  // Removes ball from array (stops tracking it)  
      ballsCollected ++;
      console.log(`Matched! Score: ${ballsCollected}`);

    } else { // Wrong colour
      lives--; // Lose a life on mismatch
      console.log(`Wrong colour! Lives left: ${lives}`);

      if (lives <= 0){
        console.log('Game Over!');
        endGame();
        return; // Exit the loop and stop the game
      }
    }
  } else if (b.y > window.innerHeight + size){
      b.el.remove(); // Remove ball element when off screen
      balls.splice(i,1); // Remove off screen balls
    }
  }

  // Each falling ball
  balls.forEach((b) => {
    if (!b.el) return; // skip missing elements
  Util.setSize(size, null, b.el);
  Util.setColour(colours[b.colourIndex], 100, 50, 1, b.el);
  Util.setPositionPixels(b.x, b.y, b.el);
  });
  


  window.requestAnimationFrame(loop);
}





// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  document.addEventListener('keydown', (event) => {
    clearTimeout(timeoutID); // Clear any existing timeout to prevent premature reset

    // Changes colour of player if space is double pressed
    if (event.code === 'Space'){ 
      playerColourIndex = (playerColourIndex + 1) % colours.length;
        console.log(`Changed colour to index ${playerColourIndex}`);
        return;
    }

    // Updating key presses for swipe 
    prevKey = currKey; 
    currKey = event.code;

    console.log(`${prevKey} -> ${currKey}`);

    let dir = swipeDirection();
    targetX += dir * step; // Update X position based on swipe direction
    targetX = Math.max(0, Math.min(targetX, window.innerWidth - size)); // Clamping targetX withinn window bounds
});



  document.addEventListener('keyup', (event) => {
    timeoutID = setTimeout(resetKeys, 100 ); // Set a timeout to reset keys after 75 milliseconds
  })


spawnTimer = setInterval(spawnBall, spawnInterval); // Start spawning balls at regular intervals

  window.requestAnimationFrame(loop);
};

setup(); // Always remember to call setup()!
