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

  // Joshua Tests
  test("Verify user cannot predict without selecting cards", async () => {
    // Click without selecting cards
    await page.click('#getTarot');
    await page.waitFor
    const outputText = await page.$eval('#output', (text) => {
      return text.innerText;
    });
    expect(outputText).toBe('<p>You did not select enough cards!</p><p></p>');
  });

  // Joshua Tests
  test("Verify user cannot predict a second time", async() => {
    // Select a Card
    await page.$eval('#card1', (card) => {
      card.click();
    });

    await page.click('#getTarot');
    const outputText = await page.$eval('#output', (text) => {
      return text.innerText;
    });

    for (let i = 0; i < 1; i++) {
      await page.click('#getTarot');
      const newText = await page.$eval('#output', (text) => {
        return text.innerText;
      });
      expect(outputText).toBe(newText);
    }
  });

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
