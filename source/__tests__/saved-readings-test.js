/**
 * @file Contains puppeteer tests for the saved readings page of the web app
 * @author Samuel Au
 * @author Michi Wada
 */

describe('Basic user flow for Saved Readings Page', () => {
    beforeAll(async () => {
        //Note this is a personal Live Server Link. So, it will not work in general.
        await page.goto('http://127.0.0.1:5500/source/fortune-telling/saved.html');
    });
    test("Check if back button takes you back to the menu page on click", async() => {
        console.log("Checking if back button takes you back to the menu page on click.");

        const button = await page.$('.backButton');
        await button.click();
        await page.waitForNavigation();

        const page2URL = await page.url();
        console.log(page2URL);
        const page2Title = await page.title();
        console.log(page2Title);

        expect(page2URL).toBe('http://127.0.0.1:5500/source/fortune-telling/menu.html');
        expect(page2Title).toBe('This is the menu page prototype');
    }, 10000);
    test("Check if clear fortune button clears the screen and local storage", async() => {
        //test times out
        await page.waitForSelector('.clearButton');
        const button = await page.$('.clearButton');
        console.log(button);
        await button.click();
        //await page.waitForNavigation();

        await page.waitForFunction(() => {
            return document.querySelector('.fortune') === null;
        });

        let fortuneElements = await page.$$('.fortune');
        expect(fortuneElements.length).toBe(0);

        let localStorageValue = await page.evaluate(() => {
            return localStorage.getItem('fortunes');
        });
        expect(localStorageValue).toBeNull();
    });
    test("Check if everything in localStorage is displayed", async() => {
        // Set up initial state of localStorage
        await page.evaluate(() => {
            let fortunes = [
                ['Fortune text 1', 'Category 1', '2023-06-01'],
                ['Fortune text 2', 'Category 2', '2023-06-02'],
                ['Fortune text 3', 'Category 3', '2023-06-03']
            ];
            localStorage.setItem('fortunes', JSON.stringify(fortunes));
        });

        // test times out...
        //await page.waitForSelector('.fortune');
        await page.waitForNavigation();

        let localStorageFortunes = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('fortunes'));
        });

        let fortuneElements = await page.$$('.fortune');

        expect(fortuneElements.length).toBe(localStorageFortunes.length);

        for (let i = 0; i < fortuneElements.length; i++) {
            let fortuneElement = fortuneElements[i];
            let displayedFortuneText = await fortuneElement.$eval('.fortuneText', el => el.textContent);
            let displayedCategory = await fortuneElement.$eval('.fortuneCategory', el => el.textContent);
            let displayedDate = await fortuneElement.$eval('.fortuneDate', el => el.textContent);

            let localStorageFortune = localStorageFortunes[i];
            let localStorageFortuneText = localStorageFortune[0];
            let localStorageCategory = localStorageFortune[1];
            let localStorageDate = new Date(localStorageFortune[2]).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

        expect(displayedFortuneText).toBe(localStorageFortuneText);
        expect(displayedCategory).toBe(localStorageCategory);
        expect(displayedDate).toBe(localStorageDate);
  }
    });
});