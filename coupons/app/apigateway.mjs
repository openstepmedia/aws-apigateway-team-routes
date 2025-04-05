/**
 * Lightweight API for managing coupons.
 * This file behaves as the entry point / front-controller for the API.
 * 
 * swagger-jsdoc is used to create an OpenAPI specification from JSDoc comments.
 */
import createAPI from 'lambda-api';
import CouponsController from './controllers/CouponsApiGatewayController.mjs';
import CouponsMiddleware from './middleware/CouponsMiddleware.mjs';

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
    }    
});

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Get API status
 *     tags: [coupons]
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
router.get('/status', async (req, res) => {
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
 *     summary: Get a coupon by ID
 *     tags: [coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: coupon details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/coupon'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', CouponsController.read);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get all coupons
 *     tags: [coupons]
 *     responses:
 *       200:
 *         description: A list of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/coupon'
 */
router.get('/',  CouponsController.all);

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new coupon with validation
 *     tags: [coupons]
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
 *                 description: The coupon's email address
 *     responses:
 *       201:
 *         description: coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/coupon'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', CouponsMiddleware.create, CouponsController.create);

/**
 * @openapi
 * /{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The coupon ID
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
 *         description: coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/coupon'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.put('/:id', CouponsController.update);

/**
 * @openapi
 * /{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/coupon'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', CouponsController.delete);

// Declare your Lambda handler
export const handler = async (event, context, callback) => {
    return router.run(event, context, callback);
};
