# Fastify Schemas

See: https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/

## PaymentSchema Example

To create an ESM file for a Fastify schema based on the provided request object, we need to define a JSON schema that describes the structure and validation rules for the `params` object. The object contains `amount`, `currency`, and `description` fields, and we’ll assume they are all required with specific types and constraints typical for a payment request.

Below is an ESM file that exports a Fastify schema for this request object:

```javascript
// paymentSchema.js

export const paymentSchema = {
  body: {
    type: 'object',
    required: ['amount', 'currency', 'description'],
    properties: {
      amount: {
        type: 'number',
        minimum: 0.01,
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
```

### Explanation:
1. **Schema Structure**:
   - The schema is defined for the request `body` (assuming the params are sent in the request body, as is common for POST requests in Fastify). If you meant URL parameters or query parameters, let me know, and I can adjust it.
   - The `type: 'object'` specifies that the input must be a JSON object.

2. **Required Fields**:
   - The `required` array lists `amount`, `currency`, and `description`, ensuring all must be present.

3. **Field Definitions**:
   - `amount`: Defined as a `number` with a `minimum` of 0.01 to prevent zero or negative payments, which is typical for payment APIs.
   - `currency`: Defined as a `string` with an `enum` to restrict values to a set of valid currencies (I included USD, EUR, GBP as examples; modify based on your needs).
   - `description`: Defined as a `string` with `minLength: 1` to ensure it’s not empty and `maxLength: 255` to set a reasonable limit.

4. **Additional Constraints**:
   - `additionalProperties: false` ensures no extra fields are allowed in the request body, enforcing strict validation.

5. **ESM Format**:
   - The file uses `export` syntax for ESM compatibility.
   - The schema is exported as `paymentSchema`, which can be imported into a Fastify route.

### Usage in Fastify:
To use this schema in a Fastify route, you would import and attach it like this:

```javascript
import { paymentSchema } from './paymentSchema.js';

fastify.post('/payment', { schema: paymentSchema }, async (request, reply) => {
  const { amount, currency, description } = request.body;
  // Handle the payment logic
  return { status: 'success', data: { amount, currency, description } };
});
```

### Notes:
- If the `params` object is meant for URL parameters (e.g., `/payment/:amount/:currency/:description`) or query parameters (e.g., `/payment?amount=1.00&currency=USD&description=Test`), the schema would need adjustments. For example, URL params use `params` instead of `body`.
- The `enum` for `currency` is a placeholder. Replace it with the actual supported currencies for your application.
- If you have specific validation rules (e.g., `amount` must have exactly two decimal places, or `description` must match a certain pattern), let me know, and I can refine the schema.
- Fastify uses Ajv for schema validation, so the schema follows JSON Schema Draft-07 conventions.
