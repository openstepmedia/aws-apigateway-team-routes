// Require the framework and instantiate it
import UsersController from './controllers/UsersController.mjs';
import UsersMiddleware from './middleware/UsersMiddleware.mjs';
import createAPI from 'lambda-api';

// instantiate framework
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

// Define a route
api.get('/status', async (req, res) => {
  return { status: 'ok' };
});

// Get one order
api.get('/:id', UsersController.read);

// Get all users
api.get('/',  UsersController.all);

// Create an order
api.post('/', UsersMiddleware.create, UsersController.create);

// Update an order
api.put('/:id', UsersController.update);

// Delete an order
api.delete('/:id', UsersController.delete);

// Declare your Lambda handler
export const handler = async (event, context, callback) => {
    // !!!IMPORTANT: Set this flag to false, otherwise the lambda function
    // won't quit until all DB connections are closed, which is not good
    // if you want to freeze and reuse these connections
    context.callbackWaitsForEmptyEventLoop = false;

    return api.run(event, context, callback);
};
