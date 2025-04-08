/**
 * couponsController
 * Each method acts as a transformer between the HTTP request and the PaymentsModel
 * Using static methods to avoid instantiating the class and keeping index.mjs cleaner.
 */
import PaymentModel from '../models/PaymentsModel.mjs';

class PaymentsApiGatewayController {

    /**
     * Retrieves all coupons
     * @async
     * @returns {Promise<Array>} A promise that resolves to an array of all coupons
     */
    static async all() {
        return PaymentModel.all();
    }

    /**
     * Creates a new coupons
     * @async
     * @param {Object} req - The HTTP request object
     * @param {Object} req.body - The request body containing coupon data
     * @param {string} req.body.email - The email of the coupon to create
     * @returns {Promise<Object>} A promise that resolves to the created coupon
     */
    static async create(req) {
        return PaymentModel.create(req.body);
    }

    /**
     * Retrieves a specific coupon by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the coupon to retrieve
     * @returns {Object|undefined} The coupon object if found, undefined otherwise
     */
    static read(req) {
        return PaymentModel.read(req.params.id);
    }

    /**
     * Updates a specific coupon by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the coupon to update
     * @param {Object} req.body - The request body containing updated coupon data
     * @param {string} req.body.email - The updated email for the coupon
     * @returns {Object|undefined} The updated coupon object if found, undefined otherwise
     */
    static update(req) {
        return PaymentModel.update(req.params.id, req.body);
    }

    /**
     * Deletes a specific coupon by ID
     * @param {Object} req - The HTTP request object
     * @param {Object} req.params - The request parameters
     * @param {string} req.params.id - The ID of the coupon to delete
     * @returns {Object|undefined} The deleted coupon object if found, undefined otherwise
     */
    static delete(req) {
        return PaymentModel.delete(req.params.id);
    }
}

export default PaymentsApiGatewayController