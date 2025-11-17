/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";
//_____________________________________________________________________________________________
// State variables are the parts of your program that change over time.

//----Game state veriables-------------------
let prevKey = null; //tracks the previously pressed key
let currKey = null; //tracks the currently pressed key
let timeoutID = null; //stores a timer that resets key presses after a short delay
let ballsCollected = 0;
let lives = 4; // Player starts with 5 lives
let spawnTimer = null; // Timer for spawning balls

//-----Player properties---------------------
let size = 100;
let X = (window.innerWidth - size)/2; // Initial horizontal position
let targetX = X; // Target horizontal position for smooth movement
let Y = (window.innerHeight - size)/1.2;  // Vertical position near bottom of screen
let colours = [0, 40, 240, 90]; // Different colours for the balls
let playerColourIndex =0; // Current colour index of player
let balls = []; // Array to store active falling balls - updated each frame

//___________________________________________________________________________________________
// Settings variables should contain all of the "fixed" parts of your programs

const spawnInterval = 2000; //milliseconds between ball spawns

const step = 70; //number of pixels to move per swipe
const smoothSpeed = 0.1; //speed of smooth movement

//---Keys that represent a row on the keyboard---(swedish keyboard)------
const row = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyÖ', 'KeyÄ']
//_______________________________________________________________________________________

// indexOf() returnes where in the array a value is located, (-1 if not found)
//----Movement of the player----------- 
function swipeDirection(){
  let prevIndex = row.indexOf(prevKey);// Find the index of the previous key in the row array
  let currIndex = row.indexOf(currKey);// Find the index of the current key in the row array
  console.log(`${prevIndex} -> ${currIndex}`);

  if( currIndex < 0 || prevIndex < 0){ // if (we dont move)
    return 0; // if either key is not in the row, return 0 (instead of -1 from indexOf())
  } else {
    let dIndex = currIndex - prevIndex; // How far apart key presses are (gives -1, 0, or 1)

    if(dIndex > 1 || dIndex < -1){
      return 0; // if the keys are not adjacent, return 0 (ignores large jumps)
    } else {
      return dIndex; // return the direction: -1 for left, 1 for right
    }
  }
}


// Resets the key presses after a short time
function resetKeys(){
  prevKey = null; 
  currKey = null; 
}



//----Game Over Sign---------------------------------------------------
function showGameOverSign(){
  const overlay = document.createElement("div");
  overlay.id = "gameOverOverlay"; // 
  overlay.style.position = "fixed";
  overlay.style.top = "10%";
  overlay.style.left = "10%";
  overlay.style.right= "10%";
  overlay.style.bottom = "10%";
  overlay.style.backgroundColor = "#c71622aa";
  overlay.style.display = "flex";
  overlay.style.padding = "100px";
  overlay.style.justifyContent = "center";
  overlay.style.fontSize = "30px";
  overlay.style.color = "#efe8e8db"
  overlay.style.fontFamily = "'Courier New', Courier, monospace";
  overlay.style.zIndex = "999"; // So overlay stays on top
  overlay.style.borderRadius = "30px";

 //---Game Over Message--------------------------
  const message = document.createElement("div");
  message.textContent = "Game Over! You collected: " + ballsCollected + " balls.";
  message.style.textAlign = "center";
  message.style.fontSize = "35px";
  message.style.top = "5px";
  overlay.appendChild(message);


  //---Restart button----------------------------
  let restartButton = document.createElement("button"); // Create a button element
  restartButton.textContent = "Try again"; // Set the button text
  restartButton.style.position = "absolute"; // position wont be effected/effect others positioning
  restartButton.style.top = "50%"; // Place it 50% from the top
  restartButton.style.left = "50%"; // Place it 50% from the left (center)
  restartButton.style.transform = "translate(-50%, -50%)"; // Center the button perfectly
  restartButton.style.padding = "10px 20px"; // Add space inside the button
  restartButton.style.fontSize = "30px"; // Make the text bigger
  restartButton.style.border = "5px"; // 
  restartButton.style.borderRadius = "10px"; // Round the corners
  restartButton.style.backgroundColor = "#d9a2cfaa"; // colour
  restartButton.style.cursor = "pointer"; // Show pointer cursor when hovering
  restartButton.style.fontFamily = "'comic sans ms', 'comic sans', cursive";

  restartButton.addEventListener('click', ()=>{
    // Restarts the game
    overlay.remove();
    restartGame();
 });

 overlay.appendChild(restartButton); // Adds restart button to overlay
 document.body.appendChild(overlay); // Adds overlay to the document body
}
//____________________________________________________________________________________

// Ball spawning 
function spawnBall(){
  const colourIndex = Math.floor(Math.random() * colours.length); // Randomize colour index
  const x = Math.random() * (window.innerWidth - size); // Randomize horizontal position (within visible screen)
  const el = Util.createThing(null, "thing"); // Create a new DOM element 
  balls.push({ x, y: -size, colourIndex, speed: 3 + Math.random() * 2, el})// Adds new ball(object) to balls array with properties
}
//Math.floor=rounds down to nearest whole number. 
//Math.random= gives number between 0 and 1


function loseLife(reason){
  lives--;
  console.log(`Lost life due to ${reason}. Lives left: ${lives}`);
  if (lives <= 0){
    console.log( 'Game Over!');
    endGame();
    return true; // game over
  }
  return false; // game continues
};





function endGame(){
  clearInterval(spawnTimer); // Stop spawning new balls
  balls.forEach(b => b.el.remove()); // Remove all ball elements from DOM
  balls = []; // Clear the ball array
  console.log(`Game Over! Total Balls Collected: ${ballsCollected}`);

  showGameOverSign();
}
// for.Each() loops through each element in the array and runs the given function on it
// remove() permanently removes the element from the DOM (not just hiding it)



function restartGame(){
  // Resets game state
  ballsCollected = 0;
  lives = 4;
  balls = [];
  X = (window.innerWidth - size)/2; // Resets player position
  targetX = X; // Resets player position 
  playerColourIndex = 0;

  // Restart spawning balls and the main loop
  spawnTimer = setInterval(spawnBall, spawnInterval);
  window.requestAnimationFrame(loop);
}




//_____________________________________________________________________________
// Code that runs over and over again
function loop() {

  // -----Player updates-----------------
  Util.setPositionPixels(X, Y);
  Util.setSize(size);
  Util.setColour(colours[playerColourIndex], 100, 50);
  
  // ----smooth player movement-------------
  X += ( targetX - X) * smoothSpeed; // Smoothly interpolate X(current position) towards targetX
  X = Math.max(0, Math.min(X, window.innerWidth - size)); // Clamp X within window bounds
 //Math.max = returns the largest of the given numbers
 //Math.min = returns the smallest of the given numbers


  // ----- Ball updates (for loop)-----------------------------------
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i]; // b = current ball being processed
    b.y += b.speed; //
  
   if (!b.el)continue; // skip missing elements


  //--Check for collisions--
  let dx = Math.abs(b.x - X); // Horizontal distance between ball and player
  let dy = Math.abs(b.y - Y); // Vertical distence between ball and player
//Math.abs() = absolute number from 0 (always returns a positive number)

  if( dx < size / 2 && dy < size /1.2){ // Collision detected
      // Correct colour collected
    if (b.colourIndex === playerColourIndex){ 
      b.el.remove(); // Remove ball element from DOM (becomes to crouded otherwise)
      balls.splice(i,1);  // Removes ball from array (stops tracking it)  
      ballsCollected ++;
      console.log(`Matched! Score: ${ballsCollected}`);

      // Wrong colour
    } else { 
      
      if (loseLife('Wrong colour')) return; // calls loseLife and ends game if its the wrong colour
    }
    // Missed ball
  } else if (b.y > window.innerHeight + size){
      b.el.remove(); // Remove ball element when off screen
      balls.splice(i,1); // Remove off screen balls
      if (loseLife('Missed too many balls')) return; // Calls function to lose a life and end game if no lives are left
    }
  }

  // -----Render remaning balls------------------
  balls.forEach((b) => {
    if (!b.el) return; // skip missing elements
  Util.setSize(size, null, b.el); 
  Util.setColour(colours[b.colourIndex], 100, 50, 1, b.el);
  Util.setPositionPixels(b.x, b.y, b.el);
  });
  

  // continue the loop
  window.requestAnimationFrame(loop);
};
//_________________________________________________________________________



//___________________________________________________________________________
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  document.addEventListener('keydown', (event) => {
    clearTimeout(timeoutID); // Clear any existing timeout to prevent premature reset

    // Changes colour of player if space is double pressed
    if (event.code === 'Space'){ 
      playerColourIndex = (playerColourIndex + 1) % colours.length; // 
        console.log(`Changed colour to index ${playerColourIndex}`);
        return;
    }

    // Updating key presses for swipe 
    prevKey = currKey; // 
    currKey = event.code; // Phisical key pressed 
    console.log(`${prevKey} -> ${currKey}`);

    let dir = swipeDirection();
    targetX += dir * step; // Update X position based on swipe direction
    targetX = Math.max(0, Math.min(targetX, window.innerWidth - size)); // Clamping targetX withinn window bounds
});



  document.addEventListener('keyup', () => {
    timeoutID = setTimeout(resetKeys, 100 ); // Set a timeout to reset keys after 100 milliseconds
  })


spawnTimer = setInterval(spawnBall, spawnInterval); // Start spawning balls at regular intervals

  window.requestAnimationFrame(loop);
};

setup(); // Always remember to call setup()!
//__________________________________________________________________________