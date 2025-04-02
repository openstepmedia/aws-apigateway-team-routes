/**
 * Generates an OpenAPI specification from annotations in the API code.
 * Usage: npm run openapidocs
 */
import * as fs from 'fs';

// Dynamic import for swagger-jsdoc (CommonJS module)
const swaggerJsdoc = (await import('swagger-jsdoc')).default;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Users API',
            description: 'A simple API for managing users',
        },
    },
    // files containing annotations as above
    apis: ['./api/index.mjs'], 
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFileSync('./api/openapi.json', JSON.stringify(openapiSpecification, null, 2));
console.log('OpenAPI specification written to api/openapi.json');
