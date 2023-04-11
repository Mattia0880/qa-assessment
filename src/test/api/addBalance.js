const { makeAxiosRequestWithExpectedStatus } = require('../../utilities/common');

// This test suite describes the behavior of the API when updating a user's balance

// GIVEN an existing user ID and valid data for a balance update
describe('GIVEN an existing user ID and valid data for a balance update', () => {
  const id = 1;
  const topup = 100;
  let initialBalance;

  // Get the initial user balance and add a topup to it
  beforeAll(async () => {
    const getUserParams = {
      url: `http://localhost:8080/api/users/${id}`,
      method: 'GET',
    };
    const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(getUserParams, 200);
    initialBalance = getUserApiResponse.data.balance;

    const requestParams = {
      url: `http://localhost:8080/api/users/${id}/addbalance`,
      method: 'PUT',
      data: {
        topup,
      }
    };
    await makeAxiosRequestWithExpectedStatus(requestParams, 201);
  });

  // Check if the user balance is updated correctly
  it('THEN the user balance is updated', async () => {
    const getUserParams = {
      url: `http://localhost:8080/api/users/${id}`,
      method: 'GET',
    };
    const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(getUserParams, 200);
    const updatedBalance = getUserApiResponse.data.balance;
    expect(updatedBalance).toBe(initialBalance + topup);
  });
});

// GIVEN an existing user ID and no topup value
describe('GIVEN an existing user ID and no topup value', () => {
  const id = 1;

  // Check if the API returns an error message when updating the user balance with no topup value
  it('WHEN I update the user balance using PUT THEN the API returns an error message', async () => {
    const requestParams = {
      url: `http://localhost:8080/api/users/${id}/addbalance`,
      method: 'PUT',
      data: {}
    };
    const response = await makeAxiosRequestWithExpectedStatus(requestParams, 400);
    expect(response.data.message).toBe('Content can not be empty!');
  });
});

// GIVEN a non-existent user ID and valid data for a balance update
describe('GIVEN a non-existent user ID and valid data for a balance update', () => {
  const id = 999;
  const topup = 100;

  // Check if the API returns an error message when updating the balance of a non-existent user
  it('WHEN I update the user balance using PUT THEN the API returns an error message', async () => {
    const requestParams = {
      url: `http://localhost:8080/api/users/${id}/addbalance`,
      method: 'PUT',
      data: {
        topup,
      }
    };
    const response = await makeAxiosRequestWithExpectedStatus(requestParams, 400);
    expect(response.data.message).toBe(`Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`);
  });
});
