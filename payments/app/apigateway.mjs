// src/server.mjs
import fastify from 'fastify';
import serverless from '@fastify/aws-lambda';
import PaymentsController from './controllers/PaymentsApiGatewayController.mjs';
import PaymentsMiddleware from './middleware/PaymentsMiddleware.mjs';

// Initialize Fastify app
const router = fastify({
  logger: true
});

// Hook to set default Content-Type for incoming requests
router.addHook('preParsing', (request, reply, payload, done) => {
    // Check if Content-Type is missing or undefined
    if (!request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
    }
    done(null, payload);
});

// Global error handler for unexpected errors
router.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  return reply.status(error.statusCode || 500).send({
    error: 'Internal Server Error',
    message: error.message
  });
});

// Define a simple route
router.get('/payments/v1/status', PaymentsController.status);

// Get payment by id
router.get('/payments/v1/:id', PaymentsController.read);

// Get all payments
router.get('/payments/v1',  PaymentsController.all);

// POST endpoint with middleware validation
router.post('/payments/v1/create', {
  preHandler: [PaymentsMiddleware.create] 
}, PaymentsController.create);

// Update payment record
router.put('/payments/v1/:id', PaymentsController.update);

// Delete payment record
router.delete('/payments/v1/:id', PaymentsController.delete);

// Export the Lambda handler
export const handler = serverless(router);