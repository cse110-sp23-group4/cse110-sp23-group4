/**
 * @file Contains the script to manage the landing page's functionality including the zoom in animation - Last Modified: 06/05/2023
 * @author Joshua Tan 
 * @author Abijit Jayachandran
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
 * This function sends the user to the menu page where they can select what type
 * of fortune they would like to receive and is called after a timeout to allow
 * for the animation to trigger.
 */
function toMenuPage() {
  window.location.href='menu-prototype.html';
}

/**
 * This function is responsible for removing the contents of the page and 
 * triggering the animation of zooming into the hut while also redirecting 
 * to the menu page after zooming in enough.
 */
function enterHut() {
    /* Go to menu page after 0.75 seconds upon clicking the button */
    setTimeout(toMenuPage, 600);
    
    /* Clear all elements from page */
    pageContents.innerHTML = '';

    /* Move background to line up with the hut door */
    hutBackground.style.backgroundPosition = '50% 77.5%';
    /* Zoom into the background image by 800% in 2 seconds */
    hutBackground.style['background-size'] = '300%';
    //hutBackground.style.transition = 'zoomIn 2s forwards'
}

/* Add the listener to the landing page button */
enterButton.addEventListener('click', enterHut);
