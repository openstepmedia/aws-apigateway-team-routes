/**
 * UsersController
 * Each method acts as a transformer between the HTTP request and the UserModel
 * @class
 * @see https://github.com/jeremydaly/lambda-api?tab=readme-ov-file#request
 * Using static methods to avoid instantiating the class and keeping index.mjs cleaner.
 */
import UserModel from '../models/UserModel.mjs';

class UsersController {

    /**
     * Retrieves all users
     * @async
     * @returns {Promise<Array>} A promise that resolves to an array of all users
     */
    static async all() {
        return UserModel.all();
    }

    /**
     * Creates a new user
     * @async
     * @param {Object} req - The HTTP request object
     * @param {Object} req.body - The request body containing user data
     * @param {string} req.body.email - The email of the user to create
     * @returns {Promise<Object>} A promise that resolves to the created user
     */
    static async create(req) {
        return UserModel.create(req.body);
    }

    /**
     * Retrieves a specific user by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the user to retrieve
     * @returns {Object|undefined} The user object if found, undefined otherwise
     */
    static read(req) {
        return UserModel.read(req.params.id);
    }

    /**
     * Updates a specific user by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the user to update
     * @param {Object} req.body - The request body containing updated user data
     * @param {string} req.body.email - The updated email for the user
     * @returns {Object|undefined} The updated user object if found, undefined otherwise
     */
    static update(req) {
        return UserModel.update(req.params.id, req.body);
    }

    /**
     * Deletes a specific user by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the user to delete
     * @returns {Object|undefined} The deleted user object if found, undefined otherwise
     */
    static delete(req) {
        return UserModel.delete(req.params.id);
    }
}

export default UsersController;