/**
 * @file Contains puppeteer tests for the landing page of the web app
 * @author Abijit Jayachandran
 */

describe('Basic user flow for Landing Page', () => {
    // First, visit the landing page
    beforeAll(async () => {
        //Note this is a personal Live Server link. So, it will not work in general. 
        console.log("Starting landing pages tests...");
        //await page.goto('http://127.0.0.1:8000/source/prototyping/landing-prototype.html');
    });

    beforeEach(async () => {
        //Note this is a personal Live Server link. So, it will not work in general. 
        await page.goto('http://127.0.0.1:8000/source/prototyping/landing-prototype.html');
    });

    test("Check if button changes colour on hover", async () => {
        console.log("Checking if button changes colour on hover...");

        const prevColor = await page.$eval('button', el => {
            return getComputedStyle(el).getPropertyValue('background-color');
        }); 
        
        //console.log("Before hover..."); 
        //console.log(prevColor); 

        const button = await page.$('button'); 
        await button.hover();

        //waits for hover transition to complete. We might want to add an event
        //listener here to make this code more flexible. TODO
        await page.waitForTimeout(300); 

        const newColor = await page.$eval('button', el => {
            return getComputedStyle(el).getPropertyValue('background-color');
        }); 
       
        //console.log("After hover...");
        //console.log(newColor);

        expect(prevColor).not.toMatch(newColor); 
    });

    test("Check if page changes to menu page on button click", async () => {
        console.log("Before button click...");

        //console.log(await page.url());
        //console.log(await page.title());

        const button = await page.$('button'); 
        //console.log(await(await button.getProperty('innerText')).jsonValue())
        await button.click(); 
        await page.waitForNavigation(); 

        //console.log("After button click..."); 

        const page2URL = await page.url(); 
        //console.log(page2URL); 
        const page2Title = await page.title(); 
        //console.log(page2Title);

        expect(page2Title).toBe('This is the menu page prototype'); 
        expect(page2URL).toBe('http://127.0.0.1:8000/source/prototyping/menu-prototype.html'); 
    });
    
    test("Check if image displays correctly ", async () => {
        let backgroundImage = await page.evaluate(() => {
            let htmlElement = document.querySelector('html');
            let styles = getComputedStyle(htmlElement);
            return styles.backgroundImage;
          });
      
          expect(backgroundImage).toBe('url(\"http://127.0.0.1:8000/source/prototyping/assets/landing-page/backdrop.png\")');
    });

    test("Check if the font displays correctly ", async () => {
        let fontLoaded = await page.evaluate(() => {
            let fontFamily1 = 'abrilFatface';
            let fontFamily2 = 'playfairDisplay';
            let font1Loaded = document.fonts.check(`1em "${fontFamily1}"`);
            let font2Loaded = document.fonts.check(`1em "${fontFamily2}"`);
            return font1Loaded && font2Loaded;
          });
      
          expect(fontLoaded).toBe(true);
    });
    
}); 
