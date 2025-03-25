/**
 * Simple user model
 * @module users/api/models/UserModel
 */
import crypto from 'crypto';

/**
 * Represents a user entity
 * @class
 */
class User {
    id;
    email;
    createdAt;

    /**
     * Creates a new User instance
     * @param {Object} params - The user parameters
     * @param {string} params.email - The user's email address
     */
    constructor(params) {
        this.id = crypto.randomUUID();
        this.email = params.email;
        this.createdAt = new Date();
    }
}

/**
 * Provides methods for managing user data
 * @class
 */
class UserModel {
    static users = [];

    /**
     * Retrieves all users
     * @returns {Array<User>} An array of all users
     */
    static all() {
        return this.users;
    }

    /**
     * Creates a new user
     * @param {Object} params - The user parameters
     * @param {string} params.email - The user's email address
     * @returns {User} The newly created user
     */
    static async create(params) {
        const user = new User({ email: params.email });
        this.users.push(user);
        return user;
    }

    /**
     * Retrieves a user by ID
     * @param {string} id - The ID of the user to retrieve
     * @returns {User|undefined} The user if found, undefined otherwise
     */
    static read(id) {
        return this.users.find(user => user.id === id);
    }

    /**
     * Updates a user by ID
     * @param {string} id - The ID of the user to update
     * @param {Object} params - The updated user parameters
     * @param {string} params.email - The updated email address
     * @returns {User|undefined} The updated user if found, undefined otherwise
     */
    static update(id, params) {
        const user = this.users.find(user => user.id === id);
        user.email = params.email;
        return user;
    }

    /**
     * Deletes a user by ID
     * @param {string} id - The ID of the user to delete
     * @returns {User|undefined} The deleted user if found, undefined otherwise
     */
    static delete(id) {
        const user = this.users.find(user => user.id === id);
        this.users = this.users.filter(user => user.id !== id);
        return user;
    }
}

export default UserModel;
