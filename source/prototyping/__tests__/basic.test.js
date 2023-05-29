describe('Basic user flow for Website', () => {
  // First, visit the landing page
  beforeAll(async () => {
    await page.goto('http://localhost:8000/landing-prototype.html');
  });

  // Check that button leads to next page
  it('Transition fro landing page to to menu on click', async () => {
    console.log('Checking that button leads to menu page...');
    await page.click('button');
    const title = await page.title();
    expect(title).toBe("This is the menu page prototype");
  }, 10000);
});
