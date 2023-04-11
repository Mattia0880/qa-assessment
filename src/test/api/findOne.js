const { makeAxiosRequestWithExpectedStatus } = require('../../utilities/common');

// Test the case where we have an existing user ID
describe('GIVEN an existing user ID', () => {
  let userId;

  // Before each test is run, create a user with a balance of 1000 and retrieve its ID
  beforeAll(async () => {
    const expectedStatus = 201;
    const requestParams = {
      url: 'http://localhost:8080/api/users',
      method: 'POST',
      data: {
        name: 'Alex',
        balance: 1000,
      },
    };

    const createUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    userId = createUserApiResponse.data.id;
  });

  // Test retrieving the user by ID with a GET request
  describe('WHEN I retrieve the user by ID using GET', () => {
    const expectedStatus = 200;
    let getUserApiResponse;

    // Before each test is run, make a GET request to retrieve the user by ID
    beforeAll(async () => {
      const requestParams = {
        url: `http://localhost:8080/api/users/${userId}`,
        method: 'GET',
      };

      getUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    });

    // Test that the user retrieved has the correct information
    it('THEN the correct user is returned in the response', () => {
      expect(getUserApiResponse.data.id).toBe(userId);
      expect(getUserApiResponse.data.name).toBe('Alex');
      expect(getUserApiResponse.data.balance).toBe(1000);
    });
  });

  // After each test is run, delete the user with the previously retrieved ID
  afterAll(async () => {
    const expectedStatus = 200;
    const requestParams = {
      url: `http://localhost:8080/api/users/${userId}`,
      method: 'DELETE',
    };

    await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
  });
});

// Test the case where we have a non-existing user ID
describe('GIVEN a non-existing user ID', () => {
  const userId = 12345;

  // Test retrieving the user by ID with a GET request
  describe('WHEN I retrieve the user by ID using GET', () => {
    const expectedStatus = 404;
    let getUserApiResponse;

    // Before each test is run, make a GET request to retrieve the user by ID
    beforeAll(async () => {
      const requestParams = {
        url: `http://localhost:8080/api/users/${userId}`,
        method: 'GET',
      };

      getUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    });

    // Test that an error message is returned when trying to retrieve a non-existing user
    it('THEN the API returns an error message', () => {
      expect(getUserApiResponse.data.message).toBe(`Cannot find User with id=${userId}.`);
    });
  });
});
