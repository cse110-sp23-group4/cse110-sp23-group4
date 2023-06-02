/* TODO: The scope of these variables may be adjusted later */
import { addFortune } from "./saved-readings-script.js";


/**
 * A reference to the number of cards the user wants to select
 * @type {int}
 */
let selectCount;

/**
 * Set the number of cards to appear to be 6
 * @type {int}
 */
let cardCount = 6;

/**
 * A reference to a button to get the tarot card predictions
 * @type {HTMLElement | null}
 */
const predictButton = document.getElementById('getTarot');

/**
 * A reference to a button to save the fortune to localStorage
 * @type {HTMLElement | null}
 */
const saveButton = document.getElementById('saveFortune');

/**
 * A reference to a button to save the fortune to localStorage
 * @type {HTMLElement | null}
 */
const saveReadingsButton = document.getElementById('savedReadingsPage');

/**
 * Array containing the id strings of all selected cards
 * @type {string[]}
 */
let selectBuffer = [];

/**
 * A reference to back button HTMlElement on card-prototype.html
 * @type {HTMLElement | null}
 */
const returnToMenuButton = document.getElementById('returnMenu');

/**
 * A reference to all card images 
 * @type {HTMLCollection<img> | null}
 */
const tarotCards = document.getElementsByClassName('card');

window.addEventListener('load', init);

/**
 * Function containing all intial setup functions for generating cards 
 * and event listeners for the buttons on the page
 */
function init() {
  for (let i = 0; i < tarotCards.length; i++) {
    tarotCards[i].addEventListener("click", function () { chooseCard(i); });
  }

  /* Get category from local storage */
  let category = JSON.parse(localStorage.getItem("category"));

  /* Set selectCount value from category */
  switch (category) {
    case "School":
    case "Love":
    case "Life":
    default:
      selectCount = 1;
      break;
  }

  /* Add event listener for predicting fortune button */
  predictButton.addEventListener("click", generatePrediction);

  /* Add event listener for save fortune button */
  saveButton.addEventListener("click", saveFortune);

  /* Add event listener for return to menu button to go back to menu page */
  returnToMenuButton.addEventListener("click", returnToMenu);

  /* Add event listener for return to menu button to go back to menu page */
  saveReadingsButton.addEventListener("click", goToSavedReadings);
}

/**
 * Function that changes to page back to the main menu
 */
function returnToMenu() {
  window.location.href = "menu-prototype.html";
}

/**
 * Function that changes the page to the save readings page
 */
function goToSavedReadings() {
  window.location.href = "saved-readings-prototype.html";
}

/**
 * A function used for an event listener in order to generate the prediction
 * when the user has selected their cards
 */
async function generatePrediction() {
  /**
   * Array containing the strings of the responses from the tarot cards
   * @type {string[]}
   */
  const numbers = ["1","2","3","4","5","6","7","8","9","10"];

  /**
   * A reference to the output area for the result of the reading
   * @type {HTMLElement | null}
   */
  const predictOut = document.getElementById('output');

  // Reset all the cards to be facing down again
  for (let i = 0; i < tarotCards.length; i++) {
    tarotCards[i].src = `assets/card-page/backside.png`;
  }

  /* Verify items are selected */
  if (selectBuffer && selectBuffer.length === selectCount) {

    /* Select a random number between 0 and 5, pick random card from number */
    let cardNumbers = generateNonDuplicateRandomNumbers(0, 5, selectBuffer.length);

    // Store chosen cards in array to iterate over later
    let cards = [];

    // For each number in the array of cardNumbers, push a card to the cards array
    cardNumbers.forEach(function(cardNumber) {
      switch (cardNumber) {
        case 0:
          cards.push("optimistic");
          break;
        case 1:
          cards.push("hopeful");
          break;
        case 2:
          cards.push("neutral");
          break;
        case 3:
          cards.push("pessimistic");
          break;
        case 4:
          cards.push("disastrous");
          break;
        case 5:
        default:
          cards.push("unexpected");
          break;
      }
    });    

    // Get the current category of the fortune telling site
    let category = JSON.parse(localStorage.getItem("category"));

    /**
     * String used for storing the output of the prediction
     * @type {string}
     */
    let outputContent = "";

    // Get the JSON containing all the fortune responses
    let response = await fetch("./assets/fortunes/fortunes.json");
    let fortuneResponses = await response.json();
      

    for (let i = 0; i < selectBuffer.length; i++) {
      // Change the images of the cards that were selected
      tarotCards[selectBuffer[i]].src = `assets/card-page/${cards[i]}.png`;

      // Pick random fortune response within card subsection to use
      let cardResponse = Math.floor(Math.random() * 2);

      outputContent += fortuneResponses[category][cards[i]][cardResponse];
    }


    /* Give the user a prediction */
    predictOut.innerHTML = `<p>${outputContent}</p>`;
  } else {
    /* Display a message that the user selected nothing */
    predictOut.innerHTML = `<p>You did not select enough cards!<p>`;
  }
}

function chooseCard (i) {
  const index = selectBuffer.indexOf(i);
  if (index == -1) {
    selectBuffer.push(i);
    tarotCards[i].style.boxShadow = "0 0 10px 5px #ff0000";

    if (selectBuffer.length > selectCount) {
      tarotCards[selectBuffer[0]].style.boxShadow = null;
      selectBuffer.shift();
    }

  } else {
    tarotCards[i].style.boxShadow = null;

    selectBuffer.splice(index, 1);
  }
}

/**
 * Function to save a fortune to localStorage for later display on the save 
 * fortunes page. Executes when the save fortune button is pressed
 */
function saveFortune() {
  // Get the output text of the fortune response
  const predictOutText = document.getElementById('output').innerHTML;

  // Get the current cateogry as a string
  let category = JSON.parse(localStorage.getItem("category"));

  // pass in fortune response, current cateogry, and date
  addFortune(predictOutText, category, new Date());
}

/**
 * Generates an array of non-duplicate random numbers within a given range.
 *
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (inclusive).
 * @param {number} count - The number of random non-duplicate numbers to generate.
 * @returns {number[]} An array of non-duplicate random numbers.
 */
function generateNonDuplicateRandomNumbers(min, max, count) {
  var numbers = [];

  while (numbers.length < count) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (numbers.indexOf(randomNumber) === -1) {
      numbers.push(randomNumber);
    }
  }
  
  return numbers;
}
