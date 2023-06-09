/**
 * @file JavaScript Code for card.html - Last Modified: 06/04/2023
 * @author Ezgi Bayraktaroglu
 * @author Helen Lin
 * @author Nakul Nandhakumar
 * @author Joshua Tan
 * @author Khanh Le
 */



/* TODO: The scope of these variables may be adjusted later */
import { addFortune } from "./saved-readings-script.js";



/**
 * A reference to the fortuneText when prediction occurs.
 * @type {string}
 */
let fortuneText = "";



/**
 * A reference to the number of cards the user wants to select
 * @type {number}
 */
let selectCount;



/**
 * A reference to the output interal for typing the fortune to the screen
 * 
 */
let typeOutputInterval;



/**
 * Set the number of cards to appear to be 6
 * @type {number}
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
 * A reference to back button HTMlElement on card.html
 * @type {HTMLElement | null}
 */
const returnToMenuButton = document.getElementById('returnMenu');



/**
 * A reference to reset button to get new fortune
 * @type {HTMLElement | null}
 */
const newFortuneButton = document.getElementById('newFortune');



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
  // Stop typing previous response if there is one being typed
  clearInterval(typeOutputInterval);

  // Add event listener to all the tarot cards so they can be selected once again
  for (let i = 0; i < tarotCards.length; i++) {
    tarotCards[i].index = i;
    tarotCards[i].addEventListener("click", chooseCard);
  }

  // Reset all the cards to be facing down again
  for (let i = 0; i < tarotCards.length; i++) {
    tarotCards[i].src = `assets/card-page/backside.png`;
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

  typePrediction(`Please Select ${selectCount} Card.`);

  /* Add event listener for predicting fortune button */
  predictButton.addEventListener("click", generatePrediction);
    
  // Remove save button
  saveButton.removeEventListener("click", saveFortune);
  saveButton.style.opacity = 0.5;

  /* Add event listener for return to menu button to go back to menu page */
  returnToMenuButton.addEventListener("click", returnToMenu);

  /* Animate the cards into position */
  wooshCards();

  /* Add event listener to save readings button to go to saved readings page*/
  if (saveReadingsButton != null)
    saveReadingsButton.addEventListener("click", goToSavedReadings);

  /* Hide the the new fortune button and add event listener to it */
  newFortuneButton.removeEventListener("click", init);
  newFortuneButton.style.opacity = 0.5;
}



/**
 * Function that changes to page back to the main menu
 */
function returnToMenu() {
  window.location.href = "menu.html";
}



/**
 * Function that changes the page to the save readings page
 */
function goToSavedReadings() {
  window.location.href = "saved.html";
}



/**
 * A function used for an event listener in order to generate the prediction
 * when the user has selected their cards
 */
async function generatePrediction() {
  /**
   * A reference to the output area for the result of the reading
   * @type {HTMLElement | null}
   */
  const predictOut = document.getElementById('output');

  // Empty the previous fortune text
  fortuneText = "";

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
    if (category == undefined)
      category = 'Life';

    // Get the JSON containing all the fortune responses
    let response = await fetch("./assets/fortunes/fortunes.json");
    let fortuneResponses = await response.json();

    for (let i = 0; i < selectBuffer.length; i++) {
        // Change the images of the cards that were selected
        tarotCards[selectBuffer[i]].src = `assets/card-page/${cards[i]}.png`;

        // Pick random fortune response within card subsection to use
        let cardResponse = Math.floor(Math.random() * 2);

      fortuneText += fortuneResponses[category][cards[i]][cardResponse];

			// Add select class to selected cards so deWoosh animation can occur
			tarotCards[selectBuffer[i]].classList.add("select");
    }
		// Animate away the unselected cards
		dewooshCards();

    // Center the selected card
    centerSelectedCard();

    /* Give the user a prediction and get the interval to stop typing is necessary */
    typePrediction(fortuneText);

    // Remove listener for predict button
    predictButton.removeEventListener("click", generatePrediction);

    // Remove event listeners for each tarot card so they can be selected
    for (let i = 0; i < tarotCards.length; i++) {
      tarotCards[i].removeEventListener("click", chooseCard);
    }

  } else {
    /* Display a message that the user selected nothing */
    typePrediction(`Please Select ${selectCount} Card.`);
  }

  // Display reset button and add event listener
  newFortuneButton.addEventListener("click", init);
  newFortuneButton.style.opacity = 1;

  // Display save fortube button
  saveButton.addEventListener("click", saveFortune);
  saveButton.style.opacity = 1.0;
}



/**
 * Takes in the prediction generate and types out the
 * prediction results by updating the html content character
 * by character
 * @param {string} - Predition result to be typed out
 */
function typePrediction(prediction) {
  const predictionChars = prediction.split("");
  let predictionCharsIndex = 0;
  const predictOut = document.getElementById("output");
  predictOut.textContent = "";

  //Interval function used to type out one char at a time
  typeOutputInterval = setInterval(()=> {
    predictOut.textContent +=predictionChars[predictionCharsIndex];
    predictionCharsIndex++;

    //Finished Typing
    if (predictionCharsIndex === predictionChars.length) {
      clearInterval(typeOutputInterval);
    }
  }, 30);
  setTimeout(() => {
    console.log((document.querySelector('#output')).innerText);
  }, 2000);

  return typeOutputInterval;
}


/**
 * Function enables the selection of cards on the fortune generation page. When
 * a card is selected, it is added to a buffer that keeps track of selected cards
 * as space and category allows. When buffer grows too big, remove first element
 * in buffer and add the new element. Selected card has permanent box shadow
 */
function chooseCard() {
  // Gets index of tarot card inside card buffer if it exists
  const index = selectBuffer.indexOf(this.index);

  // Push card to buffer if it isn't inside, if already inside then deselect card and remove it
  if (index == -1) {
    selectBuffer.push(this.index);
    tarotCards[this.index].style.boxShadow = "0 0 10px 5px #ad08c7";

    // If buffer is too big then remove first element
    if (selectBuffer.length > selectCount) {
      tarotCards[selectBuffer[0]].style.boxShadow = null;
      selectBuffer.shift();
    }
  } else {
    tarotCards[this.index].style.boxShadow = null;

    selectBuffer.splice(index, 1);
  }
}



/**
 * Function to save a fortune to localStorage for later display on the save
 * fortunes page. Executes when the save fortune button is pressed
 */
function saveFortune() {
  // Get the current cateogry as a string
  let category = JSON.parse(localStorage.getItem("category"));

  // pass in fortune response, current cateogry, and date
  addFortune(fortuneText, category, new Date());

  // Remove listener for save fortune button
  predictButton.removeEventListener("click", generatePrediction);

  // Remove event listener for save button after being clicked once
  saveButton.removeEventListener("click", saveFortune);
  saveButton.style.opacity = 0.5;
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



/**
 * Function to woosh or animate to the cards from a deck on the left
 * to being layed out for the user to pick
 * Triggered when the page is loaded.
 * Assumption: Number of Cards that could be selected from are 6
 */
function wooshCards() {
	for(let i = 0; i < tarotCards.length; i++) {
		switch (String(tarotCards[i].id)) {
			case "card1":
				tarotCards[i].style.setProperty("--changePoint", "-200%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			case "card2":
				tarotCards[i].style.setProperty("--changePoint", "-300%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			case "card3":
				tarotCards[i].style.setProperty("--changePoint", "-400%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			case "card4":
				tarotCards[i].style.setProperty("--changePoint", "-500%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			case "card5":
				tarotCards[i].style.setProperty("--changePoint", "-600%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			case "card6":
				tarotCards[i].style.setProperty("--changePoint", "-700%");
				tarotCards[i].style.animation = "woosh 2s";
				break;
			default:
				break;
		}
	}
}



/**
 * Function to dewoosh or animate to the left into a deck the unselected cards
 * Triggered when Predict button is clicked.
 * Assumption: Number of Cards that could be selected from are 6
 */
function dewooshCards() {
	for(let i = 0; i < tarotCards.length; i++) {
		if(tarotCards[i].classList == undefined) {
			break;
		}
		if(!tarotCards[i].classList.contains("select")){
			switch (String(tarotCards[i].id)) {
        /**Each Case sets css variable --changePoint and triggers deWoosh
         * keyFrame animation in card-styles.css
         */
				case "card1":
					tarotCards[i].style.setProperty("--changePoint", "-200%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card2":
					tarotCards[i].style.setProperty("--changePoint", "-300%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card3":
					tarotCards[i].style.setProperty("--changePoint", "-400%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card4":
					tarotCards[i].style.setProperty("--changePoint", "-500%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card5":
					tarotCards[i].style.setProperty("--changePoint", "-600%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card6":
					tarotCards[i].style.setProperty("--changePoint", "-700%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				default:
					break;
			}
    }
	}
}




/**
 * Function to center the selected card.
 * Triggered when Predict button is clicked.
 * ASSUMPTION: Only one Card is Selected.
 */
function centerSelectedCard() {
  for (let i=0; i < tarotCards.length; i++) {
    if (tarotCards[i].classList == undefined) {
      break;
    }

    if(tarotCards[i].classList.contains("select")) {
      switch (String(tarotCards[i].id)) {
        /**Each Case sets css variable --changePoint and triggers deWoosh
         * keyFrame animation in card-styles.css
         */
				case "card1":
					tarotCards[i].style.setProperty("--changePoint", "275%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card2":
					tarotCards[i].style.setProperty("--changePoint", "165%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card3":
					tarotCards[i].style.setProperty("--changePoint", "55%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card4":
					tarotCards[i].style.setProperty("--changePoint", "-50%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card5":
					tarotCards[i].style.setProperty("--changePoint", "-160%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				case "card6":
					tarotCards[i].style.setProperty("--changePoint", "-270%");
					tarotCards[i].style.animation = "deWoosh 2s";
					tarotCards[i].style.animationFillMode = "forwards";
					break;
				default:
					break;
      }
    }
  }
}