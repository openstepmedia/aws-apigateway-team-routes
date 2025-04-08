// lambda.mjs
import awsLambdaFastify from '@fastify/aws-lambda';
import app from './app.mjs'; // Import the configured Fastify app

// Create the handler by wrapping the Fastify app instance
const proxy = awsLambdaFastify(app);

// Export the handler function for AWS Lambda
// AWS Lambda will call this function `handler` by default.
export const handler = proxy;

// You might see alternative syntaxes like:
// export const handler = async (event, context) => {
//   return proxy(event, context);
// };
// Both achieve the same result with @fastify/aws-lambda v3+