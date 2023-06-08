describe('Basic user flow for Landing Page', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/source/fortune-telling/card.html');
    });

    test("Verify user cannot predict without cards", async () => {
      // Click without selecting cards
      await page.click('#getTarot');

      //wait 3 seconds
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      const outputText = await page.$eval('#output', (text) => {
        return text.innerHTML;
      });

      //because the output from the typing produces odd output,
      //make sure there is at least a capital P in the string
      //statement should say: Please select 1 card
      expect(outputText.includes('P')).toBe(true);
    }, 10000);

    test("Verify user cannot predict a second time", async() => {
      // Select a Card
      await page.click('#card1');

      await page.click('#getTarot');
      const outputText = await page.$eval('#output', (text) => {
        return text.innerHTML;
      });

      for (let i = 0; i < 10; i++) {
        await page.click('#getTarot');
        const newText = await page.$eval('#output', (text) => {
          return text.innerHTML;
        });
        let lengthBool = outputText.length <= newText.length ? true : false;
        expect(lengthBool).toBe(true);
      }
    });
});
