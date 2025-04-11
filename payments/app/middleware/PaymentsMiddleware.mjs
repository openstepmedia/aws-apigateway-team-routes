/**
 * CouponsMiddleware
 * Provides middleware functions for validating user-related requests
 * @class
 */
import vine from '@vinejs/vine'

class PaymentsMiddleware {
    /**
     * Middleware to validate user creation requests
     * @async
     * @param {Object} req - The HTTP request object
     * @param {Object} req.body - The request body containing user data
     * @param {string} req.body.email - The email of the user to create
     * @param {Object} res - The HTTP response object
     * @param {Function} next - The next middleware function in the stack
     * @returns {Promise<void>} A promise that resolves when validation is complete
     * @throws {Error} Throws an error if validation fails
     */
    static async create(req, res) {
        req.log.info('PaymentsMiddleware.create' + JSON.stringify(req.body));
    }

}

export default PaymentsMiddleware;
