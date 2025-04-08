/**
 * CouponsMiddleware
 * Provides middleware functions for validating user-related requests
 * @class
 */
import vine from '@vinejs/vine'
  
class PaymentsMiddleware {

    /**
     * Validates the data for creating a new user
     * @async
     * @param {Object} data - The data to validate
     * @param {string} data.email - The email to validate
     * @returns {Promise<Object>} A promise that resolves to the validated data
     * @throws {Error} Throws an error if validation fails
     */
    static async validateCreate(data) {
        const schema = vine.object({
            email: vine.string().email(),
        });
        return await vine.validate({ schema, data });
    }

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
    static async create(req, res, next) {
        await PaymentsMiddleware.validateCreate(req.body);
        next();
    }

}

export default PaymentsMiddleware;
