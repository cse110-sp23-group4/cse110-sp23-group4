window.addEventListener('DOMContentLoaded', init);

function init() {
	const history = document.querySelector(".historyWrapper");
	/**
 	 * A reference to the button to go back to the menu
 	 * @type {HTMLElement | null}
 	 */
	const backButton = document.querySelector(".backButton");
	/**
 	 * A reference to the button to add a sample fortune to test
	 * the displayFortunes function
 	 * @type {HTMLElement | null}
 	 */
	const tempAddButton = document.querySelector(".tempAddButton");
	/**
 	 * A reference to the button to clear the fortunes from
	 * local storage and from the display. Is temporary, for
	 * testing, but could be useful in the final product as well.
 	 * @type {HTMLElement | null}
 	 */
	const tempClearButton = document.querySelector(".tempClearButton");
	
	/**
	 * Adds an event listener for backButton to call the function that
	 * sends user back to menu page.
	 */
	backButton.addEventListener("click", backToMenu);
	/**
	 * Adds an event listener for tempAddButton to call the function
	 * that adds a sample fortune to localStorage and displays it.
	 */
	tempAddButton.addEventListener("click", tempAddFortuneToTest);
	/**
 	 * Adds a event listener for tempClearButton to call the function
	 * that clears fortunes from localeStorage and updates display.
 	 */
	tempClearButton.addEventListener("click", tempClearFortunes);

	/**
	 * Display fortunes when page loads
	 */
	displayFortunes();

	/**
 	 * This function sends the user back to the menu page
 	 */
	function backToMenu() {
		location.href = "https://cse110-sp23-group4.github.io/cse110-sp23-group4/source/prototyping/menu-prototype";
	}

	/**
 	 * This function clears the localStorage of (only) fortunes and
	 * calls the displayFortunes function to update the display to
	 * be cleared of fortunes. This function is called by the 
	 * event listener added to tempClearButton. This is meant to be a 
	 * temporary fuction used help test, but it could be useful for
	 * the actual page.
 	 */
	function tempClearFortunes() {
		localStorage.removeItem("fortunes");
		displayFortunes();
	}

	/**
 	 * This function adds adds a fortune and displays it to test
	 * the functionality of the displayFortunes function. It is
	 * temporary and will be removed later.
 	 */
	function tempAddFortuneToTest() {
		addFortune("fortune text", "category", new Date());
		displayFortunes();
	}

	/**
 	 * Adds a event listener that fires whenever the localstorage
	 * changes "in the context of another document" (mozilla.org)
	 * and calls the displayFortunes function.
	 * This means that if the fortune page is open in another tab
	 * and the fortune bank is open in another tab and changes are
	 * made to local storage in that other tab, the fortune bank
	 * page will detect it. This means that if a fortune is saved
	 * in the other page, this event listener will activate.
	 * It will call the displayFortunes function and update
	 * the display to include the fortune that was saved on the
	 * other tab.
 	 */
	window.addEventListener('storage', displayFortunes);

	/**
 	 * This function adds a fortune to localStorage
 	 * @param {string} - the text of the fortune
 	 * @param {string} - the category of the fortune
	 * @param {Date} - a JavaScript Date object
 	 */
	function addFortune(fortune, category, date) {
		let fortunes = getFortunes();
		fortunes.push([fortune,category,date]);
		localStorage.setItem('fortunes', JSON.stringify(fortunes));
	}
	
	/**
 	 * This function retrieves fortunes from localStorage and returns an array
	 * of fortunes. If nothing in local storage, it returns an empty array.
 	 * @param {string} - the text of the fortune
 	 * @param {string} - the category of the fortune
 	 * @returns {Array<Object>} - an array of fortunes, each with fortune, category,
	 * and date elements
 	 */
	function getFortunes() {
		if(localStorage.getItem('fortunes') == null) {
			return [];
		}else {
			let arr = [];
			let list = JSON.parse(localStorage.getItem('fortunes'));
			for(let i in list) {
				arr.push(list[i]);
			}
			return arr;
		}
	}
	
	/**
 	 * This function uses getFortunes and displays the fortunes it
	 * gets on the page with a div element for each fortune. Every
	 * time this function is called, it clears everything in the 
	 * element refered to by history and re-adds each fortune to the
	 * page. The date values of the fortunes are displayed according to
	 * the locale of the browser. So if your browser uses Spanish 
	 * for the UI, the date would be in Spanish.
 	 */
	function displayFortunes() {
		// retrieves fortunes from local storage in an array
		let arr = getFortunes();
		// clears the display of fortunes
		history.innerHTML = '';
		// loops through each fortune and displays it
		for(let i = 0; i<arr.length; i++) {
			// creates div element as wrapper
			let fortuneInList = document.createElement('div');
			fortuneInList.classList.add("fortune");
			// creates an h3 element that holds fortune text
			let fortuneText = document.createElement("h3");
			fortuneText.innerHTML = arr[i][0];
			fortuneText.classList.add("fortuneText");
			// creates an h3 element that holds fortune category
			let fortuneCategory = document.createElement("h3");
			fortuneCategory.innerHTML = arr[i][1];
			fortuneCategory.classList.add("fortuneCategory");
			// creates an h3 element that holds fortune date (specific to locale)
			let fortuneDate = document.createElement("h3");
			fortuneDate.innerHTML = new Date(arr[i][2]).toLocaleDateString(undefined, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			fortuneDate.classList.add("fortuneDate");

			// adds elements with fortune text, category, and date to the fortune div wrapper
			fortuneInList.appendChild(fortuneText);
			fortuneInList.appendChild(fortuneCategory);
			fortuneInList.appendChild(fortuneDate);
			// adds fortune wrapper to history div wrapper
			history.appendChild(fortuneInList);
		}
	}
}
