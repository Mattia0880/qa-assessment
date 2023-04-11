const { makeAxiosRequestWithExpectedStatus } = require('../../utilities/common');

describe('User deletion', () => {

  // Test suite for deleting an existing user
  describe('GIVEN a user to delete', () => {
    let userId;

    beforeAll(async () => {
      // Create a user to delete
      const createUserParams = {
        url: 'http://localhost:8080/api/users',
        method: 'POST',
        data: {
          name: 'Alex',
          balance: 1000,
        }
      };
      const createUserExpectedStatus = 201;
      const createUserApiResponse = await makeAxiosRequestWithExpectedStatus(createUserParams, createUserExpectedStatus);
      userId = createUserApiResponse.data.id;
    });

    // Test case for deleting an existing user
    describe('WHEN I delete the user using DELETE', () => {
      const expectedStatus = 200;
      const requestParams = {
        url: `http://localhost:8080/api/users/${userId}`,
        method: 'DELETE',
      };
      let deleteUserApiResponse;

      beforeAll(async () => {
        // Delete the user
        deleteUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
      });

      // Check that a success message is returned
      it('THEN the API returns a success message', () => {
        expect(deleteUserApiResponse.data.message).toBe('User was deleted successfully.');
      });

      // Check that the user is no longer present in the database
      it('THEN the user is no longer present in the database', async () => {
        const expectedStatus = 404;
        const getUserParams = {
          url: `http://localhost:8080/api/users/${userId}`,
          method: 'GET',
        };
        const getUserExpectedStatus = 404;
        const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(getUserParams, getUserExpectedStatus);
        expect(getUserApiResponse.data.message).toBe(`Cannot find User with id=${userId}.`);
      });
    });
  });

  // Test suite for deleting a non-existent user
  describe('GIVEN a non-existent user to delete', () => {
    const userId = 999;

    // Test case for deleting a non-existent user
    describe('WHEN I delete the user using DELETE', () => {
      const expectedStatus = 404;
      const requestParams = {
        url: `http://localhost:8080/api/users/${userId}`,
        method: 'DELETE',
      };
      let deleteUserApiResponse;

      beforeAll(async () => {
        // Delete the user
        deleteUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
      });

      // Check that an error message is returned
      it('THEN the API returns an error message', () => {
        expect(deleteUserApiResponse.data.message).toBe(`Cannot delete User with id=${userId}. Maybe User was not found!`);
      });
    });
  });
});
