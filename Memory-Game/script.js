/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// State variables are the parts of your program that change over time.

// Settings variables should contain all of the "fixed" parts of your programs
const activeKeys = new Set(); //creating a Set to remember which keys are currently pressed(no duplicates which would happen in an array))
const cards = [
{Symbol: '🍎', key: 'a', isMatched: false  }, //The diffrent cards (objects)
{Symbol: '🍎', key: 's', isMatched: false  }, //The diffrent cards (objects)
{Symbol: '🍇', key: 'd', isMatched: false  },
{Symbol: '🍇', key: 'f', isMatched: false  },


];
 

// Code that runs over and over again
function loop() {

  window.requestAnimationFrame(loop);
}



// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here

  //Event listener for key press down
addEventListener('keydown', (event) => {
  activeKeys.add(event.key); // Adds the currently pressed keys to the Set (activeKeys)
   
  const pressedCards= cards.filter(card => activeKeys.has(card.key) );//Filtering the cards array to get the cards tat are currently pressed
  const symbols = {}; //Creating an empty object to store the symbols of the pressed cards
  
  for (const card of pressedCards) { //Going through each pressed card
    if (!symbols[card.symbol]) symbols[card.symbol] = []; //If the symbol is not already in the object, create an empty array for it
    symbols[card.symbol].push(card); //Add the card to the array for its symbol
  }

for (const symbol in symbols) { //Going through each symbol in the symbols object
  const matchedCards = symbols[symbol]; //MatchedCards is now an array of cards that share the same symbol
  if (matchedCards.length === 2 && !matchedCards[0].matched) { //If there are two cards with the same symbol and they are not already matched
    matchedCards.forEach(d =>d.matched = true); //Mark both cards as matched
    console.log(`You have matched the ${symbol} cards!`);
  
      
    };
}

  const card = cards.find(d => d.key === event.key); // Find the card associated with the pressed key
     if (card) {  // If a card is found then log it
      console.log(`You have selected the ${card.Symbol} card.`); // Logging the selected card
     }
  console.log('Keys down:', Array.from (activeKeys )); // log the currently pressed keys
});


//Event listeners for key release
addEventListener('keyup', (event) => {
 activeKeys.delete(event.key); // Removes the key from the Set
  console.log('Keys down:', Array.from (activeKeys ));
} 
);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
