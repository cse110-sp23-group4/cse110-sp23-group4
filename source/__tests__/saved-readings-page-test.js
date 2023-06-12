/**
 * @file Contains puppeteer tests for the saved readings page of the web app - Last Modified: 06/11/2023
 * @author Samuel Au
 * @author Michi Wada
 * @author Abijit Jayachandran 
 */

describe('Basic user flow for Saved Readings Page', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:8000/source/fortune-telling/saved.html');
    });

    test("Check if back button takes you back to the menu page on click", async() => {
        console.log("Checking if back button takes you back to the menu page on click...");

        const button = await page.$('.backButton');
        await button.click();
        await page.waitForNavigation();

        const page2URL = await page.url();
        const page2Title = await page.title();

        expect(page2URL).toBe('http://127.0.0.1:8000/source/fortune-telling/menu.html');
        expect(page2Title).toBe('The Fortune Hut - Menu');
    });

    test("Check if clear fortune button clears the screen and local storage", async() => {
        await page.goto("http://127.0.0.1:8000/source/fortune-telling/saved.html");
        console.log("Check if clear fortune button clears the screen and local storage...");

        //get clearButton and click it
        await page.waitForSelector('.clearButton');
        const clearButton = await page.$('.clearButton');
        await clearButton.click();

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
        console.log("Check if everything in localStorage is displayed...");

        // Set up initial state of localStorage
        await page.evaluate(() => {
            let fortunes = [
                ['Fortune text 1', 'Category 1', '2023-06-01'],
                ['Fortune text 2', 'Category 2', '2023-06-02'],
                ['Fortune text 3', 'Category 3', '2023-06-03']
            ];
            localStorage.setItem('fortunes', JSON.stringify(fortunes));
            console.log(localStorage.getItem('fortunes'));
        });

        page.reload(); 
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

    test("Check if all buttons have hover effect", async () => {
        console.log("Check if all buttons have hover effect...");
        let buttons = await page.$$('button');
        let numButtons = buttons.length;

        prevBoxShadows = page.$$('button', el => {
            return getComputedStyle(el).getPropertyValue('box-shadow');
        });

        for(let i = 0; i < numButtons; i++){
            await buttons[i].hover();

            const newBoxShadows = await page.$$('button', el => {
                return getComputedStyle(el).getPropertyValue('box-shadow');
            });

            expect(prevBoxShadows[i]).not.toBe(newBoxShadows[i]);
        }
    }); 

    test("Check that saved fortunes persist after some navigation and page reloads", async () => {
        console.log("Check that saved fortunes persist through navigation and reloads...");
        // Set up initial state of localStorage
        await page.evaluate(() => {
            let fortunes = [
                ['Fortune text 1', 'Category 1', '2023-06-01'],
                ['Fortune text 2', 'Category 2', '2023-06-02'],
                ['Fortune text 3', 'Category 3', '2023-06-03']
            ];
            localStorage.setItem('fortunes', JSON.stringify(fortunes));
            console.log(localStorage.getItem('fortunes'));
        });

        //Some navigation through the app and page reloads
        page.reload();  
        await page.waitForNavigation(); 
        await (await page.$('.backButton')).click();
        await page.waitForNavigation();
        await(await page.$('#back')).click();
        await page.waitForNavigation();
        page.reload(); 
        await page.waitForNavigation();
        await(await page.$('button')).click();
        await page.waitForNavigation();
        await(await page.$('#savedReadings')).click();
        await page.waitForNavigation();
        page.reload();     
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
    }, 10000);
});