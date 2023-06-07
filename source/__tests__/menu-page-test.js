/**
 * @file Contains puppeteer E2E tests for the menu page of the web app - Last Modified: 06/04/2023
 * @author Abijit Jayachandran, Brandon Imai
 */

describe('Basic user flow for Menu Page', () => {

    beforeAll(async () => {
        console.log("Menu page tests starting...");
        //await page.goto('http://127.0.0.1:8000/source/prototyping/menu-prototype.html');
    });

    beforeEach(async () => {
        await page.goto('http://127.0.0.1:8000/source/prototyping/menu-prototype.html');
    });

    test("Check if there are 5 buttons on the screen on load", async () =>{
        console.log("Checking if there are 5 buttons on the screen on load...");
        const numButtons = await page.$$eval('button', (buttons) =>{
            return buttons.length;
        });
        expect(numButtons).toBe(5);
    });

    test("Check if all buttons have the wood plank background", async() => {
        console.log("Checking if all buttons have the wood background...");
        const buttons = await page.$$('button');
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            // Evaluate the CSS property for each button
            const propertyValue = await page.evaluate(element => {
              const computedStyle = window.getComputedStyle(element);
              return computedStyle.getPropertyValue('background');
            }, button);
            expect(propertyValue.includes('assets/menu-page/wood-placard.png')).toBe(true);
          }
    });

    test("Check if saved readings button takes you to the saved readings page on click", async () => {
        console.log("Checking if saved readings button takes you to the saved readings page on click...");

        const button = await page.$('#savedReadings');
        await button.click();
        await page.waitForNavigation();

        const page2URL = await page.url();
        //console.log(page2URL);
        const page2Title = await page.title();
        //console.log(page2Title);

        expect(page2Title).toBe('This is the prototype history page');
        expect(page2URL).toBe('http://127.0.0.1:8000/source/prototyping/saved-readings-prototype.html');
    });

    test("Check if back button takes you back to landing page on click", async () => {
        console.log("Checking if back button takes you back to landing page on click...");
        const button = await page.$('#back');
        //console.log(await(await button.getProperty('innerText')).jsonValue());
        await button.click();
        await page.waitForNavigation();

        const page2URL = await page.url();
        //console.log(page2URL);
        const page2Title = await page.title();
        //console.log(page2Title);

        expect(page2Title).toBe('The Fortune Hut');
        expect(page2URL).toBe('http://127.0.0.1:8000/source/prototyping/landing-prototype.html');
    });

    test("Check if all buttons show hover animation", async () => {
        console.log("Checking if hover animations work...");
        let buttons = await page.$$('button');
        let numButtons = buttons.length;
        //console.log(buttons.length);

        prevBoxShadows = page.$$('button', el => {
            return getComputedStyle(el).getPropertyValue('box-shadow');
        });

        for(let i = 0; i < numButtons; i++){

            //console.log("Before hover...");
            //console.log(prevBoxShadow);

            //const button = await page.$('button');
            await buttons[i].hover();

            const newBoxShadows = await page.$$('button', el => {
                return getComputedStyle(el).getPropertyValue('box-shadow');
            });

            //console.log("After hover...");
            //console.log(newBoxShadow);

            console.log(newBoxShadows[i]);
            expect(prevBoxShadows[i]).not.toBe(newBoxShadows[i]);
        }
    });

    test("Check if all the category buttons take you to the card reading page on click", async () => {
        console.log("Checking if all category buttons take you to the card reading page on click...");

        const button = await page.$('.categoryButton');
        const buttons = await page.$$('.categoryButton');

        await button.click();
        await page.waitForNavigation();

        const page2URL = await page.url();
        //console.log(page2URL);
        const page2Title = await page.title();
        //console.log(page2Title);

        for(let i = 0; i < buttons.length; i++){
            await button.click();
            await page.waitForNavigation();

            const page2URL = await page.url();
            //console.log(page2URL);
            const page2Title = await page.title();
            //console.log(page2Title);

            expect(page2Title).toBe('The Fortune Hut');
            expect(page2URL).toBe('http://127.0.0.1:8000/source/prototyping/card-prototype.html');
        }
    });
});
