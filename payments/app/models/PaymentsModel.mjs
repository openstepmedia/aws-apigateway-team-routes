/**
 * Simple payment model
 * @module payments/api/models/paymentModel
 */
import crypto from 'crypto';

/**
 * Represents a Payment
 * @class
 */
class Payment {
    id;
    amount;
    currency;
    createdAt;

    /**
     * Creates a new payment instance
     * @param {Object} params - The payment parameters
     * @param {string} params.email - The payment payment's email address
     */
    constructor(params) {
        this.id = crypto.randomUUID();
        this.amount = params.amount;
        this.currency = params.currency || 'USD';
        this.createdAt = new Date();
    }
}

/**
 * Provides methods for managing payment data
 * @class
 */
class PaymentModel {
    static payments = [];

    /**
     * Retrieves all payments
     * @returns {Array<payment>} An array of all payment
     */
    static all() {
        return this.payments;
    }

    /**
     * Creates a new payment
     * @param {Object} params - The payment parameters
     * @param {string} params.email - The payment's email address
     * @returns {payment} The newly created payment
     */
    static async create(params) {
        const payment = new Payment({ 
            amount: params.amount,
            currency: params.currency,
        });
        this.payments.push(payment);
        return payment;
    }

    /**
     * Retrieves a payment by ID
     * @param {string} id - The ID of the payment to retrieve
     * @returns {payment|undefined} The payment if found, undefined otherwise
     */
    static read(id) {
        return this.payments.find(payment => payment.id === id);
    }

    /**
     * Updates a payment by ID
     * @param {string} id - The ID of the payment to update
     * @param {Object} params - The updated payment parameters
     * @param {string} params.email - The updated email address
     * @returns {payment|undefined} The updated payment if found, undefined otherwise
     */
    static update(id, params) {
        const payment = this.payments.find(payment => payment.id === id);
        payment.email = params.email;
        return payment;
    }

    /**
     * Deletes a payment by ID
     * @param {string} id - The ID of the payment to delete
     * @returns {payment|undefined} The deleted payment if found, undefined otherwise
     */
    static delete(id) {
        const payment = this.payments.find(payment => payment.id === id);
        this.payments = this.payments.filter(payment => payment.id !== id);
        return payment;
    }
}

export default PaymentModel;
