/**
 * @file Contains puppeteer tests for the cards page of the web app - Last Modified: 06/07/2023
 * @author Christian Lee
 * @author Joshua Tan
 * @author Abijit Jayachandran
 */

describe('Basic user flow for Fortune Generation Page', () => {
  // First, visit the landing page
  beforeAll(async () => { 
      console.log("Starting card page tests...");
      await page.goto('http://localhost:8000/source/fortune-telling/card.html');
  });


  test("Verify user is asked to select a card on load", async() => {
    //waits for the prompt to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const initialText = await page.$eval('#output', (text) => {
      return text.innerHTML;
    });

    expect(initialText).toBe('Please Select 1 Card.')
  })

  test("Verify user cannot predict without selecting cards", async () => {
    // Click without selecting cards
    await page.click('#getTarot');

    //waits for the output to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const outputText = await page.$eval('#output', (text) => {
      return text.innerHTML;
    });

    expect(outputText).toBe('Please Select 1 Card.');    
  }, 5000);

  test("Verify user cannot predict a second time", async() => {
    // Select a Card
    await page.$eval('#card1', (card) => {
      card.click();
    });

    await page.click('#getTarot');

    let outputText;
    //wait for the fortune to be generated
    //the longest fortune in the bank is 449 chars = 22.45 secs generation time
    //since each character takes around 50ms to generate.
    await new Promise((resolve, reject) => setTimeout(resolve, 25000));
    
    outputText = await page.$eval('#output', (text) => {
      return text.innerText;
    });

    await page.click('#getTarot');

    let newText; 
    //give opportunity for newText to change (Note: it should NOT change)
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    newText = await page.$eval('#output', (text) => {
      return text.innerText;
    });

    expect(outputText).toBe(newText);
  }, 30000);

  test("Check that 6 cards were generated", async () => {
    const cards = await page.$$('.card');
    expect(cards.length).toBe(6);
  });

  test('Check that clicking card creates shadow', async () => {
    const style = await page.$eval('#card1', (card) => {
      card.click();
      return card.style.boxShadow;
    });
    expect(style).toBe('rgb(173, 8, 199) 0px 0px 10px 5px');
  });

  test('Check that predict button creates fortune', async () => {
    await page.click('#getTarot');
    const text = await page.$eval('#output', (text) => {
      return text.innerText;
    });
    expect(text).not.toBe('');
  });

  test('Check that save fortune button saves fortune', async () => {
    let fortuneBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('fortunes')));
    await page.click('#saveFortune');
    let fortuneAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('fortunes')));
    if (fortuneBefore) {
      expect(fortuneBefore.length - fortuneAfter.length).toBe(1);
    }
    else {
      expect(fortuneAfter.length).toBe(1);
    }
  });

  test('Check that menu page button returns to menu', async () => {
    await page.click('#returnMenu');
    const url = await page.url();
    expect(url).toBe('http://localhost:8000/source/fortune-telling/menu.html');
  });
}); 
