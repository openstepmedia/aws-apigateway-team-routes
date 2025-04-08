// middleware/validateEmail.mjs

/**
 * Simple email validation middleware.
 * Checks if email exists in the body and contains '@'.
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
export async function validateEmail(request, reply) {
    const email = request.body?.email;
  
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      // Log the issue for debugging
      request.log.warn({ body: request.body }, 'Invalid email received');
  
      // Send a 400 Bad Request response and stop processing
      reply.code(400).send({ error: 'Invalid or missing email address.' });
      // IMPORTANT: Returning reply prevents the request from proceeding further
      return reply;
    }
  
    // If valid, log and continue to the main handler
    request.log.info(`Email validation passed for: ${email}`);
    // No return value or returning nothing implicitly allows processing to continue
  }
  
  // Export specifically if needed elsewhere, but often used directly in route options
  // export default validateEmail;