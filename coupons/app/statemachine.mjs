/**
 * Lightweight API for managing users.
 * This file behaves as the entry point / front-controller for the API.
 * 
 * swagger-jsdoc is used to create an OpenAPI specification from JSDoc comments.
 */
import createAPI from 'lambda-api';
import CouponsStatemachineController from './controllers/CouponsStatemachineController.mjs';

// instantiate framework
// @see https://github.com/jeremydaly/lambda-api
const apiVersion = process.env.API_VERSION || 'v1.0';

const router = createAPI({ 
    version: apiVersion,
    base: '/' + process.env.API_BASE + '/' + apiVersion, 
    logger: {
        level: process.env.API_LOG_LEVEL || 'info',
        access: true,
        customKey: 'detail',
        messageKey: 'message',
        timestamp: () => new Date().toUTCString(), // custom timestamp
        stack: true,
    },
    // IMPORTANT: Set this to false to disable the default lambda-api callback
    serializer: (data) => data
});

/**
 * Execute statemachine state1
 */
router.post('/state1', CouponsStatemachineController.state1);

/**
 * Execute statemachine state2
 */
router.post('/state2', CouponsStatemachineController.state2);

/**
 * For Statemachine, remove the default lambda-api callback
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
export const handler = async (event, context) => {
    console.debug('event:', event);
    console.debug('context:', context);

    /**
     * Force method to 'post' to trick lambda-json to think this is an api-gateway request.
     */
    event.httpMethod = 'post';

    /**
     * If you are using persistent connections in your function routes 
     * (such as AWS RDS or Elasticache), be sure to 
     * set context.callbackWaitsForEmptyEventLoop = false; 
     * This will allow the freezing of connections and 
     * will prevent Lambda from hanging on open connections. 
     * See: https://docs.aws.amazon.com/lambda/latest/dg/services-alb.html
     */
    context.callbackWaitsForEmptyEventLoop = false; 

    /**
     * Wait for lambda-api to execute
     */
    const response = await router.run(event, context);

    /**
     * For statemachines - strip out all header info.
     */
    return response.body;
};
