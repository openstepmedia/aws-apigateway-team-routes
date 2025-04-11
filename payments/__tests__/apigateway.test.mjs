/**
 * Usage:
 * npm run test -- apigateway.test.mjs --resetModules --bail
 */
import { handler } from '../app/apigateway.mjs';

describe('Payments API', () => {
  test('should return a status of ok', async () => {

    const event = {
      httpMethod: 'get',
      path: '/payments/v1/status',
    };
    const context = {};

    const result = await handler(event, context);

    // Result is object, body is a json string
    const body = JSON.parse(result.body);
    console.debug('body', body);

    expect(body.status).toEqual('ok');
    expect(body.build).toEqual(process.env.BUILD_NUMBER || '0');
    expect(result.statusCode).toBe(200);
  });


  test('should create payment record', async () => {

    const params = {
      amount: 10.00,
      currency: 'USD',
      description: 'Test payment',
    };

    const event = {
      httpMethod: 'post',
      path: '/payments/v1/create',
      body: JSON.stringify(params),
    };
    const context = {};

    const result = await handler(event, context);

    // Result is object, body is a json string
    const body = JSON.parse(result.body);
    expect(body.id).toEqual(expect.any(String));
  });

  test('should fail to create payment record', async () => {

    const params = {
      amount: 1.00,
      currency: 'USD',
      description: 'Test payment',
    };

    const event = {
      httpMethod: 'post',
      path: '/payments/v1/create',
      body: JSON.stringify(params),
    };
    const context = {};

    const result = await handler(event, context);

    console.debug('result', result);

    expect(result.statusCode).toBe(500);
  });

  test('should get all payments', async () => {
    const event = {
      httpMethod: 'get',
      path: '/payments/v1',
    };
    const context = {};

    const result = await handler(event, context);

    const body = JSON.parse(result.body);
    expect(body).toEqual(expect.any(Array));    
    expect(result.statusCode).toBe(200);
  });   


  test('should get single payment', async () => {
    const params = {
      amount: 15.00,
      currency: 'USD',
      description: 'Test payment',
    };

    const postEvent = {
      httpMethod: 'post',
      path: '/payments/v1/create',
      body: JSON.stringify(params),
    };    

    const context = {};

    const postResult = await handler(postEvent, context);
    const postId = JSON.parse(postResult.body).id;

    const getEvent = {
      httpMethod: 'get',
      path: `/payments/v1/${postId}`,
    };

    const getResult = await handler(getEvent, context);
    const getId = JSON.parse(getResult.body).id;
    
    console.debug('postId', postId);
    console.debug('getId', getId);

    expect(postId).toBe(getId);
    expect(getResult.statusCode).toBe(200);
  }); 

});
