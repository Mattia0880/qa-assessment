const { makeAxiosRequestWithExpectedStatus } = require('../../utilities/common');

// This test suite describes the behavior of the API when valid data for a user is provided
describe('GIVEN valid data for a user', () => {

  // These variables represent valid data for a new user
  const name = 'Alex';
  const balance = 1000;
  let userId;

  // This test case checks if a new user can be created using a POST request
  describe('WHEN I create a new user using POST', () => {
    const expectedStatus = 201;
    const requestParams = {
      url: 'http://localhost:8080/api/users',
      method: 'POST',
      data: {
        name,
        balance,
      }
    };
    let createUserApiResponse;
    beforeAll(async () => {
      createUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    });

    it('THEN the user created is returned in the response', () => {
      expect(createUserApiResponse.data.name).toBe(name);
      expect(createUserApiResponse.data.balance).toBe(balance);
      userId = createUserApiResponse.data.id;
    });
  });

  // This test case checks if an error message is returned when a new user is created without the name field
  describe('WHEN I create a new user without the name field', () => {
    const expectedStatus = 400;
    const requestParams = {
      url: 'http://localhost:8080/api/users',
      method: 'POST',
      data: {
        balance,
      }
    };
    let createUserApiResponse;
    beforeAll(async () => {
      createUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    });

    it('THEN the API returns an error message', () => {
      expect(createUserApiResponse.data.message).toBe('Name field must be present in the body');
    });
  });

  // This test case checks if an error message is returned when a new user is created with a name that is too long or too short
  describe('WHEN I create a new user with a name that is too long or too short', () => {
    const longName = 'TestTestTestTestTestTestTestTestTestTestTestTestTestTest';
    const shortName = 'A';

    // This test case checks if an error message is returned when the name is too long
    it('THEN the API returns an error message when the name is too long', async () => {
      const expectedStatus = 400;
      const requestParams = {
        url: 'http://localhost:8080/api/users',
        method: 'POST',
        data: {
          name: longName,
          balance: 1000,
        }
      };
      const response = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
      expect(response.data.message).toBe('Name field must be between 2 and 20 characters');
    });

    // This test case checks if an error message is returned when the name is too short
    it('THEN the API returns an error message when the name is too short', async () => {
      const expectedStatus = 400;
      const requestParams = {
        url: 'http://localhost:8080/api/users',
        method: 'POST',
        data: {
          name: shortName,
          balance: 1000,
        }
      };
      const response = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
      expect(response.data.message).toBe('Name field must be between 2 and 20 characters');
    });
  });
});

describe('WHEN I create a new user with a name containing special characters', () => {
  // Define the expected HTTP status code for this test case
  const expectedStatus = 400;
  // Define an invalid name that contains special characters
  const invalidName = 'Test@test';
  // Define the request parameters for creating a new user with an invalid name
  const requestParams = {
    url: 'http://localhost:8080/api/users',
    method: 'POST',
    data: {
      name: invalidName,
      balance: 1000,
    }
  };
  // Declare a variable to hold the response from the API
  let createUserApiResponse;

  // Execute the API request before running the test cases
  beforeAll(async () => {
    createUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
  });

  // Check that the API returns an error message
  it('THEN the API returns an error message', () => {
    expect(createUserApiResponse.data.message).toBe(`Name field must not contain special characters: ${invalidName}`);
  });
});

// Clean up by deleting the user that was created in the first test case
afterAll(async () => {
  // Define the expected HTTP status code for this API request
  const expectedStatus = 200;
  // Define the request parameters for deleting the user
  const requestParams = {
    url: `http://localhost:8080/api/users/${userId}`,
    method: 'DELETE',
  };
  // Execute the API request to delete the user
  await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus)
  });
});
