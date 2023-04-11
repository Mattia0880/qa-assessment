describe('UserDetail', () => {
  it('tops up user balance with valid data', async () => {
    const topUpAmount = '50';

    await page.goto('http://localhost:8080/users/1');

    // enter top up amount
    const topUpInput = await page.$('#topup');
    await topUpInput.click({ clickCount: 3 });
    await topUpInput.type(topUpAmount);

    // submit form
    const submitButton = await page.$('#updateBalance');
    await submitButton.click();

    // check success message
    const successMessage = await page.waitForSelector('#message', { visible: true });
    expect(successMessage).toBeTruthy();

    // check that user balance was updated
    const balanceText = await page.$eval('#balance', el => el.textContent);
    const balance = parseInt(balanceText.replace(/[^\d.-]/g, ''));
    expect(balance).toBe(150);
  });

  it('displays an error message when top up amount is negative', async () => {
    const topUpAmount = '-50';

    await page.goto('http://localhost:8080/users/1');

    // enter top up amount
    const topUpInput = await page.$('#topup');
    await topUpInput.click({ clickCount: 3 });
    await topUpInput.type(topUpAmount);

    // submit form
    const submitButton = await page.$('#updateBalance');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Invalid top up amount');
  });

  it('displays an error message when top up amount is not a number', async () => {
    const topUpAmount = 'abc';

    await page.goto('http://localhost:8080/users/1');

    // enter top up amount
    const topUpInput = await page.$('#topup');
    await topUpInput.click({ clickCount: 3 });
    await topUpInput.type(topUpAmount);

    // submit form
    const submitButton = await page.$('#updateBalance');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Invalid top up amount');
  });
});
