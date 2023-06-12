/**
 * @file Contains puppeteer tests for the landing page of the web app - Last Modified: 06/07/2023
 * @author Abijit Jayachandran
 * @author Michi Wada
 */

describe('Basic user flow for Landing Page', () => {

    beforeAll(async () => {
        console.log("Starting landing pages tests...");
    });
    // Visit the landing page before every test.
    beforeEach(async () => {
        await page.goto('http://127.0.0.1:8000/source/fortune-telling/landing.html');
    });

    test("Check if button changes colour on hover", async () => {
        console.log("Checking if button changes colour on hover...");

        const prevColor = await page.$eval('button', el => {
            return getComputedStyle(el).getPropertyValue('background-color');
        });

        const button = await page.$('button');
        await button.hover();

        //waits for hover transition to complete. We might want to add an event
        //listener here to make this code more flexible. TODO
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));

        const newColor = await page.$eval('button', el => {
            return getComputedStyle(el).getPropertyValue('background-color');
        });

        expect(prevColor).not.toMatch(newColor);
    });

    test("Check if page changes to menu page on button click", async () => {
        console.log("Before button click...");

        const button = await page.$('button');
        const [response] = await Promise.all([
            page.waitForNavigation(), // The promise resolves after navigation has finished
            button.click(), // Clicking the link will indirectly cause a navigation
          ]);

        const page2URL = await page.url();
        const page2Title = await page.title();

        expect(page2Title).toBe('The Fortune Hut - Menu');
        expect(page2URL).toBe('http://127.0.0.1:8000/source/fortune-telling/menu.html');
    });

    test("Check if image displays correctly ", async () => {
        let backgroundImage = await page.evaluate(() => {
            let htmlElement = document.querySelector('html');
            let styles = getComputedStyle(htmlElement);
            return styles.backgroundImage;
          });

          expect(backgroundImage).toBe('url(\"http://127.0.0.1:8000/source/fortune-telling/assets/landing-page/backdrop.png\")');
    });

});
