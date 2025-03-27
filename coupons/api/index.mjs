/**
 * Lightweight API for managing users.
 * This file behaves as the entry point / front-controller for the API.
 * 
 * swagger-jsdoc is used to create an OpenAPI specification from JSDoc comments.
 */
import createAPI from 'lambda-api';
import CouponsController from '../controllers/CouponsController.mjs';
import CouponsMiddleware from '../middleware/CouponsMiddleware.mjs';

// instantiate framework
// @see https://github.com/jeremydaly/lambda-api
const apiVersion = process.env.API_VERSION || 'v1.0';

const api = createAPI({ 
    version: apiVersion,
    base: '/' + process.env.API_BASE + '/' + apiVersion, 
    logger: {
        level: process.env.API_LOG_LEVEL || 'info',
        access: true,
        customKey: 'detail',
        messageKey: 'message',
        timestamp: () => new Date().toUTCString(), // custom timestamp
        stack: true,
    }    
});

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Get API status
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: API status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 build:
 *                   type: string
 *                   description: Build number
 *                 status:
 *                   type: string
 *                   example: ok
 *                 routes:
 *                   type: array
 *                   description: Available API routes
 */
api.get('/status', async (req, res) => {
    return { 
        build: process.env.BUILD_NUMBER || '0',
        status: 'ok',
        routes: api.routes(),
    };
});
  
/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
api.get('/:id', CouponsController.read);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
api.get('/',  CouponsController.all);

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new user with validation
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
api.post('/', CouponsMiddleware.create, CouponsController.create);

/**
 * @openapi
 * /{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
api.put('/:id', CouponsController.update);

/**
 * @openapi
 * /{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
api.delete('/:id', CouponsController.delete);

// Declare your Lambda handler
export const handler = async (event, context, callback) => {
    return api.run(event, context, callback);
};
