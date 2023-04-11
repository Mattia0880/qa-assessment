describe('MakeTransfer', () => {
  it('makes a transfer with valid data', async () => {
    const amount = '20';

    await page.goto('http://localhost:8080/transfer/1');

    // select receiver
    const receiverSelect = await page.$('#receiver');
    await receiverSelect.click();
    await page.select('#receiver', '2');

    // enter amount
    const amountInput = await page.$('#amount');
    await amountInput.click({ clickCount: 3 });
    await amountInput.type(amount);

    // submit form
    const submitButton = await page.$('#createTransaction');
    await submitButton.click();

    // check success message
    const successMessage = await page.waitForSelector('#message', { visible: true });
    expect(successMessage).toBeTruthy();

    // check that sender balance was updated
    const senderBalanceText = await page.$eval('#balance', el => el.textContent);
    const senderBalance = parseInt(senderBalanceText.replace(/[^\d.-]/g, ''));
    expect(senderBalance).toBe(80);

    // check that receiver balance was updated
    await page.goto('http://localhost:8080/users/2');
    const receiverBalanceText = await page.$eval('#balance', el => el.textContent);
    const receiverBalance = parseInt(receiverBalanceText.replace(/[^\d.-]/g, ''));
    expect(receiverBalance).toBe(120);
  });

  it('displays an error message when sender does not have enough funds for the transfer', async () => {
    const amount = '100';

    await page.goto('http://localhost:8080/transfer/1');

    // select receiver
    const receiverSelect = await page.$('#receiver');
    await receiverSelect.click();
    await page.select('#receiver', '2');

    // enter amount
    const amountInput = await page.$('#amount');
    await amountInput.click({ clickCount: 3 });
    await amountInput.type(amount);

    // submit form
    const submitButton = await page.$('#createTransaction');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Insufficient funds');
  });

  it('displays an error message when transfer amount is negative or zero', async () => {
    const amount = '-10';

    await page.goto('http://localhost:8080/transfer/1');

    // select receiver
    const receiverSelect = await page.$('#receiver');
    await receiverSelect.click();
    await page.select('#receiver', '2');

    // enter amount
    const amountInput = await page.$('#amount');
    await amountInput.click({ clickCount: 3 });
    await amountInput.type(amount);

    // submit form
    const submitButton = await page.$('#createTransaction');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Invalid amount');
  });

  it('displays an error message when trying to transfer to oneself', async () => {
    const amount = '50';

    await page.goto('http://localhost:8080/transfer/1');

    // select receiver
    const receiverSelect = await page.$('#receiver');
    await receiverSelect.click();
    await page.select('#receiver', '1');

    // enter amount
    const amountInput = await page.$('#amount');
    await amountInput.click({ clickCount: 3 });
    await amountInput.type(amount);

    // submit form
    const submitButton = await page.$('#createTransaction');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Cannot transfer to oneself');
  });
});
