describe('Basic user flow for Landing Page', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/source/prototyping/card-prototype.html');
    });

    test("Verify user cannot predict without cards", async () => {
      // Click without selecting cards
      await page.click('#getTarot');
      const outputText = await page.$eval('#output', (text) => {
        return text.innerHTML;
      });
      expect(outputText).toBe('<p>You did not select enough cards!</p><p></p>');
    });

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
        expect(outputText).toBe(newText);
      }
    });
});
