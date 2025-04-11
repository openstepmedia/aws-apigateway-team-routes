/**
 * paymentsController
 * Each method acts as a transformer between the HTTP request and the PaymentsModel
 * Using static methods to avoid instantiating the class and keeping index.mjs cleaner.
 */
import PaymentModel from '../models/PaymentsModel.mjs';

class PaymentsApiGatewayController {

    static async status(req, res) {
        res.status(200).send({
            status: 'ok',
            build: process.env.BUILD_NUMBER || '0'
        });
    }

    /**
     * Retrieves all payments
     * @async
     * @returns {Promise<Array>} A promise that resolves to an array of all payments
     */
    static async all() {
        return PaymentModel.all();
    }

    /**
     * Creates a new payments
     * @async
     * @param {Object} req - The HTTP request object
     * @param {Object} req.body - The request body containing payment data
     * @param {string} req.body.email - The email of the payment to create
     * @returns {Promise<Object>} A promise that resolves to the created payment
     */
    static async create(req) {
        return PaymentModel.create(req.body);
    }

    /**
     * Retrieves a specific payment by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the payment to retrieve
     * @returns {Object|undefined} The payment object if found, undefined otherwise
     */
    static read(req) {
        return PaymentModel.read(req.params.id);
    }

    /**
     * Updates a specific payment by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the payment to update
     * @param {Object} req.body - The request body containing updated payment data
     * @param {string} req.body.email - The updated email for the payment
     * @returns {Object|undefined} The updated payment object if found, undefined otherwise
     */
    static update(req) {
        return PaymentModel.update(req.params.id, req.body);
    }

    /**
     * Deletes a specific payment by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the payment to delete
     * @returns {Object|undefined} The deleted payment object if found, undefined otherwise
     */
    static delete(req) {
        return PaymentModel.delete(req.params.id);
    }
}

export default PaymentsApiGatewayController