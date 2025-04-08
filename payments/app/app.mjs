// app.mjs
import Fastify from 'fastify';
import userRoutes from './routes/users.mjs';

// Configure Fastify
const app = Fastify({
  logger: true
});

// Register a simple root route
app.get('/', async (request, reply) => {
  return { message: 'Welcome to the User API!' };
});

// Register user routes with a prefix
// This makes routes available under /users/v1/:id, /users/v1, etc.
app.register(userRoutes, { prefix: '/users' });


// --- Optional: For local development ---
// This part allows running `node app.mjs` locally
// It should NOT run when deployed to Lambda
const startLocal = async () => {
    try {
        const port = process.env.PORT || 3000;
        await app.listen({ port: port, host: '0.0.0.0' }); // Listen on all interfaces
        app.log.info(`Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// Check if the file is run directly (for local dev)
// This check might not be perfectly robust in all ESM scenarios but works commonly.
// A more robust way might involve environment variables.
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log("Starting in local development mode...");
    startLocal();
}
// --- End Optional Local Development Block ---


// Export the configured app instance for the Lambda handler
export default app;