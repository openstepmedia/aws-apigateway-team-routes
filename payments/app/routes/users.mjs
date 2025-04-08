// routes/users.mjs
import { validateEmail } from '../middleware/validateEmail.mjs';

// Simple in-memory store (replace with a database in a real app)
const users = new Map();
let nextId = 1;

/**
 * Encapsulates user routes
 * @param {import('fastify').FastifyInstance} fastify
 * @param {object} options Plugin options
 */
async function userRoutes(fastify, options) {

  // --- GET /v1/:id ---
  fastify.get('/v1/:id', async (request, reply) => {
    const userId = parseInt(request.params.id, 10);
    const user = users.get(userId);

    if (!user) {
      reply.code(404).send({ error: 'User not found' });
      return;
    }
    request.log.info(`Workspaceed user with id: ${userId}`);
    reply.send(user);
  });

  // --- GET /v1 ---
  fastify.get('/v1', async (request, reply) => {
    request.log.info('Fetching all users');
    // Convert Map values to an array for JSON serialization
    reply.send(Array.from(users.values()));
  });


  // --- POST /v1 ---
  fastify.post('/v1', {
    // Apply middleware before the handler runs
    preHandler: [validateEmail]
  }, async (request, reply) => {
    const { name, email } = request.body;

    if (!name) {
        reply.code(400).send({ error: 'Missing required field: name' });
        return;
    }

    const newUser = {
      id: nextId++,
      name,
      email,
      createdAt: new Date().toISOString()
    };

    users.set(newUser.id, newUser);
    request.log.info({ user: newUser }, `Created new user`);

    // Send 201 Created status code
    reply.code(201).send(newUser);
  });

}

export default userRoutes;