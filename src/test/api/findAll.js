const { makeAxiosRequestWithExpectedStatus } = require('../../utilities/common');

// Test case to get all users
describe('WHEN I get all users using GET', () => {
  const expectedStatus = 200;
  let getAllUsersApiResponse;

  // Send a GET request to the users endpoint before running the test case
  beforeAll(async () => {
    const requestParams = {
      url: 'http://localhost:8080/api/users',
      method: 'GET',
    };
    getAllUsersApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
  });

  // Expect an array of users to be returned
  it('THEN the API returns an array of users', () => {
    expect(Array.isArray(getAllUsersApiResponse.data)).toBe(true);
  });

  // Test case to get a 404 error when making a GET request to an invalid endpoint
  describe('WHEN I make a GET request to an invalid endpoint', () => {
    const expectedStatus = 404;
    let invalidGetResponse;

    // Send a GET request to a non-existent endpoint before running the test case
    beforeAll(async () => {
      const requestParams = {
        url: 'http://localhost:8080/api/users/non-existent-endpoint',
        method: 'GET',
      };
      invalidGetResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    });

    // Expect a 'Not Found' error message to be returned
    it('THEN the API returns an error message', () => {
      expect(invalidGetResponse.data.message).toBe('Not Found');
    });
  });
});
