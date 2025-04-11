/**
 * Payments State Machine
 * Using fastify to manage routes
 * Allows statemachine to leverage validation, middleware, and other features of fastify.
 */
import fastify from 'fastify';
import serverless from '@fastify/aws-lambda';
import PaymentsController from './controllers/PaymentsStatemachineController.mjs';

// instantiate framework
const apiVersion = process.env.API_VERSION || 'v1';

// Initialize Fastify app
const router = fastify({ logger: true });

/**
 * Execute statemachine state1
 */
router.post(`/payments/${apiVersion}/state1`, PaymentsController.state1);

/**
 * Execute statemachine state2
 */
router.post(`/payments/${apiVersion}/state2`, PaymentsController.state2);

// Wrap Fastify with serverless for Lambda compatibility
const serverlessHandler = serverless(router);

// Export the Lambda handler
export const handler = async (event, context) => {
    // Force httpMethod to POST for statemachine lambdas
    event.body = JSON.stringify(event.body);
    event.headers = {
        'Content-Type': 'application/json',
        ...event.headers
    };
    event.httpMethod = 'POST';

    // Call the serverless handler with the modified event
    const result = await serverlessHandler(event, context);

    // Return the body as an object to statemachine
    return JSON.parse(result.body);
}
