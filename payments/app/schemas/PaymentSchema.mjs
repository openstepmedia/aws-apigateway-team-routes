// paymentSchema.js
export const PaymentSchema = {
    body: {
        type: 'object',
        required: ['amount', 'currency', 'description'],
        properties: {
            amount: {
                type: 'number',
                minimum: 10,
                description: 'The payment amount, must be a positive number with at least 0.01'
            },
            currency: {
                type: 'string',
                enum: ['USD', 'EUR', 'GBP'], // Example currencies, adjust as needed
                description: 'The currency code (e.g., USD)'
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                description: 'A brief description of the payment'
            }
        },
        additionalProperties: false
    }
};