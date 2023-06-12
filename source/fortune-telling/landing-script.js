/**
 * @file Script to control the landing page's functionality including the zoom 
 * in animation to enter the hut. - Last Modified: 06/11/2023
 * @author Nakul Nandhakumar
 * @author Joshua Tan
 * @author Abijit Jayachandran
 * @author Samuel Au
 */

/**
 * A reference to the html element of the page which defines the background-image
 * @type {HTMLElement | null}
 */
hutBackground = document.querySelector('html');

/**
 * A reference to the body element of the page which includes the page contents
 * @type {HTMLElement | null}
 */
pageContents = document.querySelector('body');

/**
 * A reference to the button for entering the hut and triggering the animation
 * @type {HTMLElement | null}
 */
enterButton = document.querySelector('button');

/**
 * A function to get the button for playing the woosh sound
 */
function playWoosh() {
  let woosh = document.getElementById("woosh");
  woosh.volume = 0.3;
  woosh.play();
}

/**
 * This function sends the user to the menu page where they can select what type
 * of fortune they would like to receive and is called after a timeout to allow
 * for the animation to trigger.
 */
function toMenuPage() {
  setTimeout(function() {
    window.location.href = "menu.html";
  }, 750);
}

/**
 * This function is responsible for removing the contents of the page and 
 * triggering the animation of zooming into the hut while also redirecting 
 * to the menu page after zooming in enough.
 */
function enterHut() {
    /* Go to menu page after 0.75 seconds upon clicking the button */
    toMenuPage();
    /* Clear all elements from page */
    pageContents.innerHTML = '';

    /* Move background to line up with the hut door */
    hutBackground.style.backgroundPosition = '50% 77.5%';
    /* Zoom into the background image by 800% in 2 seconds */
    hutBackground.style.backgroundSize = '1200%';
}

/* Add the listener to the landing page button */
enterButton.addEventListener('click', () => {
  setTimeout(enterHut, 750);
  playWoosh();
});

/**
 * Function which detects the first click on the page
 * and automatically begins playing the background track
 */
document.addEventListener("DOMContentLoaded", function() {
  let backgroundMusic = document.getElementById("music");
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
});
