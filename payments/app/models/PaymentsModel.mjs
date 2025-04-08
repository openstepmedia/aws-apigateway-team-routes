/**
 * Simple coupon model
 * @module coupons/api/models/couponModel
 */
import crypto from 'crypto';

/**
 * Represents a coupon's coupon
 * @class
 */
class Payment {
    id;
    email;
    createdAt;

    /**
     * Creates a new Coupon instance
     * @param {Object} params - The Coupon parameters
     * @param {string} params.email - The Coupon coupon's email address
     */
    constructor(params) {
        this.id = crypto.randomUUID();
        this.email = params.email;
        this.createdAt = new Date();
    }
}

/**
 * Provides methods for managing Coupon data
 * @class
 */
class PaymentModel {
    static coupons = [];

    /**
     * Retrieves all coupons
     * @returns {Array<Coupon>} An array of all Coupon
     */
    static all() {
        return this.coupons;
    }

    /**
     * Creates a new coupon
     * @param {Object} params - The Coupon parameters
     * @param {string} params.email - The Coupon's email address
     * @returns {Coupon} The newly created Coupon
     */
    static async create(params) {
        const coupon = new Coupon({ email: params.email });
        this.coupons.push(coupon);
        return coupon;
    }

    /**
     * Retrieves a coupon by ID
     * @param {string} id - The ID of the coupon to retrieve
     * @returns {Coupon|undefined} The coupon if found, undefined otherwise
     */
    static read(id) {
        return this.coupons.find(coupon => coupon.id === id);
    }

    /**
     * Updates a coupon by ID
     * @param {string} id - The ID of the coupon to update
     * @param {Object} params - The updated coupon parameters
     * @param {string} params.email - The updated email address
     * @returns {Coupon|undefined} The updated coupon if found, undefined otherwise
     */
    static update(id, params) {
        const coupon = this.coupons.find(coupon => coupon.id === id);
        coupon.email = params.email;
        return coupon;
    }

    /**
     * Deletes a coupon by ID
     * @param {string} id - The ID of the coupon to delete
     * @returns {Coupon|undefined} The deleted coupon if found, undefined otherwise
     */
    static delete(id) {
        const coupon = this.coupons.find(coupon => coupon.id === id);
        this.coupons = this.coupons.filter(coupon => coupon.id !== id);
        return coupon;
    }
}

export default PaymentModel;
