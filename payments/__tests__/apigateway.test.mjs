/**
 * Usage:
 * npm run test -- apigateway.test.mjs --resetModules --bail
 */
const api = await import('../app/apigateway.mjs');

describe('Coupons API', () => {
  test('should return a status of ok', async () => {
    const event = {
      httpMethod: 'get',
      path: '/payments/v1/status',
      body: {},
    };
    const context = {};

    const result = api.handler(event, context);

    // Result is object, body is a json string
    const body = JSON.parse(result.body);
    console.debug('body', body);

    expect(body.status).toEqual('ok');
    expect(body.build).toEqual(process.env.BUILD_NUMBER || '0');
    expect(result.statusCode).toBe(200);
  });
});
