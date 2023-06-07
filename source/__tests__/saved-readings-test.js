/**
 * @file Contains puppeteer tests for the saved readings page of the web app
 * @author Samuel Au
 */

describe('Basic user flow for Saved Readings Page', () => {
    beforeAll(async () => {
        //Note this is a personal Live Server Link. So, it will not work in general.
        await page.goto('http://127.0.0.1:8000/source/prototyping/saved-readings-prototype.html');
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

        expect(page2URL).toBe('http://127.0.0.1:8000/source/prototyping/menu-prototype.html');
        expect(page2Title).toBe('This is the menu page prototype');
    });
});