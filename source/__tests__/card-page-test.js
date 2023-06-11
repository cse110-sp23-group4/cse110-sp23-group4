/**
 * @file Contains puppeteer tests for the cards page of the web app - Last Modified: 06/09/2023
 * @author Christian Lee
 * @author Joshua Tan
 * @author Abijit Jayachandran
 */

let allResponses = [];

describe('Basic user flow for Fortune Generation Page', () => {
  // First, go to the card page
  beforeAll(async () => { 
    console.log("Starting card page tests...");
    await page.goto('http://localhost:8000/source/fortune-telling/card.html');
  });

  test("Check that 6 cards were generated", async () => {
    const cards = await page.$$('.card');
    expect(cards.length).toBe(6);
  });

  test("Verify user is asked to select a card on load", async() => {
    //waits for the prompt to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const initialText = await page.$eval('#output', (text) => {
      return text.innerHTML;
    });

    expect(initialText).toBe('Please Select 1 Card.');
  });

  test('Check that user can click through different cards', async () => {
    const cards = await page.$$('.card');
    for(let i = 0; i < cards.length; i++){
      const oldShadow = await page.$eval('#card'+(i+1), card => {
        return getComputedStyle(card).getPropertyValue('box-shadow');
      });

      await page.click('#card' + (i+1));

      const newShadow = await page.$eval('#card'+(i+1), card => {
        return getComputedStyle(card).getPropertyValue('box-shadow');
      });

      expect(oldShadow).not.toBe(newShadow);
      expect(newShadow).toBe('rgb(173, 8, 199) 0px 0px 10px 5px');
      // unclick
      await page.click('#card' + (i+1));
    }
  });

  test('Check that boxShadow changes on hover', async () => {
    const cards = await page.$$('.card');
    for(let i = 0; i < cards.length; i++){
      const oldShadow = await page.$eval('#card'+(i+1), card => {
        return getComputedStyle(card).getPropertyValue('box-shadow');
      });

      await page.hover('#card' + (i+1));

      const newShadow = await page.$eval('#card'+(i+1), card => {
        return getComputedStyle(card).getPropertyValue('box-shadow');
      });

      expect(oldShadow).not.toBe(newShadow);
      expect(newShadow).toBe('rgb(173, 8, 199) 0px 0px 10px 5px');
    }
  });

  test('Check that clicking card creates shadow', async () => {
    const style = await page.$eval('#card1', async (card) => {
      await card.click();
      return card.style.boxShadow;
    });
    expect(style).toBe('rgb(173, 8, 199) 0px 0px 10px 5px');
  });

  test('Check that unclicking card removes shadow', async () => {
    const style = await page.$eval('#card1', (card) => {
      card.click();
      return card.style.boxShadow;
    });
    expect(style).toBe('');
  });

  test("Verify user cannot predict without selecting cards", async () => {
    //waits for the output to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // Click without selecting cards
    await page.click('#getTarot');

    //waits for the output to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const outputText = await page.$eval('#output', (text) => {
      return text.innerHTML;
    });

    expect(outputText).toBe('Please Select 1 Card.');    
  }, 10000);

  test ('Verify user cannot save fortune without predicting', async () => {
    let fortuneBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('fortunes')));
    await page.click('#saveFortune');
    let fortuneAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('fortunes')));
    if (fortuneBefore) {
      expect(fortuneBefore.length).toBe(fortuneAfter.length);
    }
    else {
      expect(fortuneAfter).toBeNull();
    }
  });

  test ('Verify user cannot reset without first predicting', async () => {
    await page.click('#card1');
    const oldStyle = await page.$eval('#card1', card => {
      return card.style.boxShadow;
    });
    await page.click('#reset');
    const newStyle = await page.$eval('#card1', card => {
      return card.style.boxShadow;
    });
    // Should not be able to reset cards
    expect(oldStyle).toBe(newStyle);
  });

  test('Check that predict button creates fortune', async () => {
    // wait for page to load
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await page.click('#getTarot');

    // wait for output to be generated
    await new Promise((resolve, reject) => setTimeout(resolve, 25000));
    const text = await page.$eval('#output', (text) => {
      return text.innerText;
    });
    console.log(text);
    let badResponses = ['', 'Please Select 1 Card.'];
    expect(badResponses).not.toContain(text);
  }, 30000);
  
  test("Verify user cannot predict a second time", async() => {
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
    await page.goBack();
  });

  test('Check that saved reading button goes to saved reading page', async () => {
    await page.click('#savedReadingsPage');
    const url = await page.url();
    expect(url).toBe('http://localhost:8000/source/fortune-telling/saved.html');
    await page.goBack();
  });
}); 
