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
let lastSpacePress = 0;
let score = 0;

//Player properties
let size = 100;
let X = (window.innerWidth - size)/2;
let targetX = X;
let Y = (window.innerHeight - size)/1.2; 
let colours = [0, 120, 240]; // Diffrent colours for the balls
let playerColourIndex =0; // Current colour index of player
let balls = [];
// Settings variables should contain all of the "fixed" parts of your programs
const gravity = 0.1; //pixels per frame squared 
const spawnInterval = 2000; //milliseconds between ball spawns

const step = 50; //number of pixels to move per swipe
const smoothSpeed = 0.1; //speed of smooth movement

// Keys that represent a row on the keyboard 
const row = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL']



function spawnBall(){
  const colourIndex = Math.floor(Math.random() * colours.length);
  const x = Math.random() * (window.innerWidth - size);
  const el = Util.createThing(null, "thing");
  balls.push({ x, y: -size, colourIndex, speed: 3 + Math.random() * 2, el})
}


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
  

  //Check for collisions 
  let dx = Math.abs(b.x - X); // Horizontal distance between ball and player
  let dy = Math.abs(b.y - Y); // Vertical distence bbetween ball and player
  if( dx < size / 2 && dy < size /1.2){ // Collision detected
    b.el.remove(); // Remove ball element from DOM (becomes to crouded otherwise)
    if (b.colourIndex === playerColourIndex){
      score ++;
      console.log(`Matched! Score: ${score}`);
    } else {
      score--;
      console.log(`Missed! Score: ${score}`);
    }
    balls.splice(i,1); // Remove ball from array
  } else if (b.y > window.innerHeight + size){
    b.el.remove(); // Remove ball element when off screen
    balls.splice(i,1); // Remove off screen balls
    }
  }

  // Draw each falling ball
  balls.forEach((b) => {
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
      const now = performance.now();
      if (now - lastSpacePress < 300){
        playerColourIndex = (playerColourIndex + 1) % colours.length;
        console.log(`Changed colour to index ${playerColourIndex}`);
      }
      lastSpacePress = now;
      return;
    }


    prevKey = currKey;
    currKey = event.code;

    console.log(`${prevKey} -> ${currKey}`);

    let dir = swipeDirection();
    targetX += dir * step; // Update X position based on swipe direction
    targetX = Math.max(0, Math.min(targetX, window.innerWidth - size)); // Clamping targetX withinn window bounds
});



  document.addEventListener('keyup', (event) => {
    timeoutID = setTimeout(resetKeys, 75); // Set a timeout to reset keys after 75 milliseconds
  })


setInterval(spawnBall, spawnInterval);

  window.requestAnimationFrame(loop);
};

setup(); // Always remember to call setup()!
