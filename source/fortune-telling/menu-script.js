/**
 * @file JavaScript Code for menu.html
 * @author FIGURE OUT AUTHORS AND WRITE!!
 */

/**
 * A reference to the div containing all the category Buttons on menu.html
 * @type {HTMLCollection<Element>}
 */
const categories = document.getElementById('categories');

/**
 * Array of category Buttons to create
 * @type {HTMLCollection<String>}
 */
const titles = [
  "School",
  "Love",
  "Life",
];

/**
 * A reference to back button HTMlElement on menu.html
 * @type {HTMLElement | null}
 */
const backButton = document.getElementById('back');

/**
 * A reference to Saved Readings button HTMlElement on menu.html
 * @type {HTMLElement | null}
 */
const savedReadingsButton = document.getElementById('savedReadings');

/**
 * A function used for an event listener which is responsible for performing the
 * necessary actions when a card is clicked on by the user such as saving card
 * category type and redirecting them
 */
function setCardLink(i) {
  /* Set data in local storage based on clicked category */
  localStorage.setItem('category', JSON.stringify(titles[i]));
  window.location.href = 'card.html';
}

/**
 * A function used for an event listener which is responsible for performing the
 * necessary actions when the landing page is clicked on by the user
 */
function setLandingLink() {
  window.location.href = 'landing.html';
}

/**
 * A function used for an event listener which is responsible for performing the
 * necessary actions when the saved readings page is clicked
 */
function setSavedReadingsLink() {
  window.location.href = 'saved.html';
}

/**
 * A function used for an event listener which is responsible for creating the
 * category Buttons with each category when the page is loaded
 */
function createCategoryButtons() {
  for (let i = 0; i < titles.length; i++) {
    let newCategory = document.createElement("button");
    newCategory.setAttribute("class", "categoryButton");
    newCategory.textContent = titles[i];

    newCategory.addEventListener('click', function () {
      setCardLink(i);
    });
    categories.appendChild(newCategory);
  }
}

window.addEventListener('DOMContentLoaded', createCategoryButtons);

/*
 * Adds an onClick listner to the reference to the back button html element on
 * menu.html so that when clicked the user gets navigated to the
 * Landing Page (landing.html)
 */
backButton.addEventListener('click', setLandingLink);

/*
 * Adds an onClick listener to the reference to the Saved Readings button html
 * element on menu.html so that when clicked the user gets navigated
 * to the Saved Readings Page (saved-readings.html)
 */
savedReadingsButton.addEventListener('click', setSavedReadingsLink);

