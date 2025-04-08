/**
 * Lightweight API for managing payment records.
 * This file behaves as the entry point / front-controller for the API.
 * 
 * swagger-jsdoc is used to create an OpenAPI specification from JSDoc comments.
 */
import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import PaymentsController from './controllers/PaymentsApiGatewayController.mjs';
import PaymentsMiddleware from './middleware/PaymentsMiddleware.mjs';

// instantiate framework
const apiVersion = process.env.API_VERSION || 'v1';
const router = Fastify({
    logger: true
});

router.get('/status', async (req, res) => {
    return { 
        build: process.env.BUILD_NUMBER || '0',
        status: 'ok',
        routes: router.routes(),
    };
});

// Get payment by id
router.get('/:id', PaymentsController.read);

// Get all payments
router.get('/',  PaymentsController.all);

// Create a new payment with middleware validation
// router.post('/', { preHandler: [PaymentsMiddleware.create] }, PaymentsController.create);
router.post('/',  PaymentsController.create);

// Update payment record
router.put('/:id', PaymentsController.update);

// Delete payment record
router.delete('/:id', PaymentsController.delete);

// router.register(router, { prefix: 'payments/v1' });

// Declare your Lambda handler
export const handler = awsLambdaFastify(router);