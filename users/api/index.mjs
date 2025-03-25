/**
 * Lightweight API for managing users.
 * This file behaves as the entry point / front-controller for the API.
 */
import createAPI from 'lambda-api';
import UsersController from './controllers/UsersController.mjs';
import UsersMiddleware from './middleware/UsersMiddleware.mjs';

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
api.get('/status', async (req, res) => {
  return { status: 'ok' };
});

// Get one user
api.get('/:id', UsersController.read);

// Get all users
api.get('/',  UsersController.all);

// Create an user with validation middleware
api.post('/', UsersMiddleware.create, UsersController.create);

// Update a user
api.put('/:id', UsersController.update);

// Delete a user
api.delete('/:id', UsersController.delete);

// Declare your Lambda handler
export const handler = async (event, context, callback) => {
    return api.run(event, context, callback);
};
