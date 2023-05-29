/* TODO: The scope of these variables may be adjusted later */

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
      selectCount = 3;
      break;
    case "Love":
    case "Life":
    default:
      selectCount = 1;
      break;
  }

  /* Add event listener for predicting fortune button */
  predictButton.addEventListener("click", generatePrediction);

  /* Add event listener for return to menu button to go back to menu page */
  returnToMenuButton.addEventListener("click", returnToMenu);
}

function returnToMenu() {
  window.location.href = "menu-prototype.html";
}

/**
 * A function used for an event listener in order to generate the prediction
 * when the user has selected their cards
 */
function generatePrediction() {
  /* 
   * TODO: Write out the actual predictions and maybe make the prediction 
   * algorithm smarter instead of PRNG 
   */
  
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

  /* Verify items are selected */
  if (selectBuffer && selectBuffer.length === selectCount) {
    /* Get a random fortune */
    res = Math.floor(Math.random() * cardCount);

    /**
     * String used for storing the output of the prediction
     * @type {string}
     */
    let outputContent = "";

    /* Add selected cards to output */
    for (let i = 0; i < selectBuffer.length; i++)
      outputContent += `${tarotCards[selectBuffer[i]].id} `;

    /* Give the user a prediction */
    predictOut.innerHTML = `<p>You selected the following: ${outputContent}<br>Here is a random number: ${numbers[res % selectBuffer.length]}</p>`;
  } else {
    /* Display a message that the user selected nothing */
    predictOut.innerHTML = `<p>You did not select anything stupid!<p>`;
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
