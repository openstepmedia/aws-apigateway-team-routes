/**
 * Lightweight API for managing users.
 * This file behaves as the entry point / front-controller for the API.
 */
import createAPI from 'lambda-api';

// instantiate framework
// @see https://github.com/jeremydaly/lambda-api
const api = createAPI({ 
    version: process.env.API_VERSION || 'v1.0',
    base: process.env.API_BASE, 
    logger: {
        level: process.env.API_LOG_LEVEL || 'info',
        access: true,
        customKey: 'detail',
        messageKey: 'message',
        timestamp: () => new Date().toUTCString(), // custom timestamp
        stack: true,
    }    
});

// Status check
api.get('/build', async (req, res) => {
  return { build: process.env.BUILD_NUMBER || 'unknown' };
});
  
// Declare your Lambda handler
export const handler = async (event, context, callback) => {
    return api.run(event, context, callback);
};
