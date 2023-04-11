describe('CreateUser', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/create-user');
  });

  it('creates a new user with valid data', async () => {
    const name = 'John';
    const balance = '100';

    // enter name
    const nameInput = await page.$('#name');
    await nameInput.click({ clickCount: 3 });
    await nameInput.type(name);

    // enter balance
    const balanceInput = await page.$('#balance');
    await balanceInput.click({ clickCount: 3 });
    await balanceInput.type(balance);

    // submit form
    const submitButton = await page.$('#createUser');
    await submitButton.click();

    // check success message
    const successMessage = await page.waitForSelector('#successMessage', { visible: true });
    expect(successMessage).toBeTruthy();

    // check that user was created
    const userRow = await page.waitForSelector(`#user-${name}`, { visible: true });
    expect(userRow).toBeTruthy();
  });

  it('displays an error message when trying to create a user with no name', async () => {
    // enter balance
    const balanceInput = await page.$('#balance');
    await balanceInput.click({ clickCount: 3 });
    await balanceInput.type('100');

    // submit form
    const submitButton = await page.$('#createUser');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
  });

  it('displays an error message when trying to create a user with an invalid balance', async () => {
    // enter name
    const nameInput = await page.$('#name');
    await nameInput.click({ clickCount: 3 });
    await nameInput.type('John');

    // enter invalid balance
    const balanceInput = await page.$('#balance');
    await balanceInput.click({ clickCount: 3 });
    await balanceInput.type('invalid');

    // submit form
    const submitButton = await page.$('#createUser');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
  });

  it('displays an error message when trying to create a user with a name that already exists', async () => {
    // enter existing name
    const nameInput = await page.$('#name');
    await nameInput.click({ clickCount: 3 });
    await nameInput.type('John');

    // enter balance
    const balanceInput = await page.$('#balance');
    await balanceInput.click({ clickCount: 3 });
    await balanceInput.type('100');

    // submit form
    const submitButton = await page.$('#createUser');
    await submitButton.click();

    // check error message
    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
  });
});
