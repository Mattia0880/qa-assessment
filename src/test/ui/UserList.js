describe('Users List Page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/users');
  });

  it('should display a list of users', async () => {
    const userList = await page.waitForSelector('#userList', { visible: true });
    const users = await userList.$$('li');
    expect(users.length).toBeGreaterThan(0);
  });

  it('should display user details when clicked', async () => {
    const user = await page.waitForSelector('#user-1', { visible: true });
    await user.click();

    const name = await page.waitForSelector('#name', { visible: true });
    const balance = await page.waitForSelector('#balance', { visible: true });
    const addBalanceBtn = await page.waitForSelector('#addBalance', { visible: true });
    const makeTransactionBtn = await page.waitForSelector('#makeTransaction', { visible: true });

    expect(name).toBeTruthy();
    expect(balance).toBeTruthy();
    expect(addBalanceBtn).toBeTruthy();
    expect(makeTransactionBtn).toBeTruthy();
  });

  it('should add balance to a user', async () => {
    const user = await page.waitForSelector('#user-1', { visible: true });
    await user.click();

    const addBalanceBtn = await page.waitForSelector('#addBalance', { visible: true });
    await addBalanceBtn.click();

    const topupField = await page.waitForSelector('#topup', { visible: true });
    await topupField.click({ clickCount: 3 });
    await topupField.type('100');

    const updateBalanceBtn = await page.waitForSelector('#updateBalance', { visible: true });
    await updateBalanceBtn.click();

    const balance = await page.waitForSelector('#balance', { visible: true });
    expect(balance.textContent).toContain('1100');
  });

  it('should make a transaction between two users', async () => {
    const user = await page.waitForSelector('#user-1', { visible: true });
    await user.click();

    const makeTransactionBtn = await page.waitForSelector('#makeTransaction', { visible: true });
    await makeTransactionBtn.click();

    const receiverSelect = await page.waitForSelector('#receiver', { visible: true });
    await receiverSelect.select('2');

    const amountField = await page.waitForSelector('#amount', { visible: true });
    await amountField.click({ clickCount: 3 });
    await amountField.type('100');

    const createTransactionBtn = await page.waitForSelector('#createTransaction', { visible: true });
    await createTransactionBtn.click();

    const message = await page.waitForSelector('#message', { visible: true });
    expect(message.textContent).toContain('Transaction Successful');
  });

  it('should display an error message when no users are found', async () => {
    const searchInput = await page.waitForSelector('#searchInput', { visible: true });
    await searchInput.click({ clickCount: 3 });
    await searchInput.type('nonexistentusername');

    const searchBtn = await page.waitForSelector('#searchBtn', { visible: true });
    await searchBtn.click();

    const errorMessage = await page.waitForSelector('#errorMessage', { visible: true });
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('No users found');
  });
});
