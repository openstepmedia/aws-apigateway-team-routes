/**
 * Usage:
 * npm run test -- api.index.test.mjs --resetModules --bail
 */
const api = await import('../app/apigateway.mjs');

describe('Coupons API', () => {
  test('should return a status of ok', async () => {
    const event = {
      httpMethod: 'get',
      path: '/coupons/v1/status',
      body: {},
    };
    const context = {};

    const result = await api.handler(event, context);

    // Result is object, body is a json string
    const body = JSON.parse(result.body);
    console.debug('body', body);

    expect(body.status).toEqual('ok');
    expect(body.build).toEqual(process.env.BUILD_NUMBER || '0');
    expect(result.statusCode).toBe(200);
  });

  test('should create a single coupon', async () => {
    const event = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {
        email: 'username@domain.com'
      },
    };
    const context = {};

    const result = await api.handler(event, context);

    const body = JSON.parse(result.body);

    expect(body.total).toEqual(event.body.total);
    expect(result.statusCode).toBe(200);
  });

  test('should fail to create coupon', async () => {
    const event = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {},
    };
    const context = {};

    const result = await api.handler(event, context);

    expect(result.statusCode).toBe(500);
  });   

  test('should create coupons then get coupons', async () => {
    const postEvent = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {
        email: 'username@domain.com'
      },
    };
    const context = {};

    const postResult = await api.handler(postEvent, context);
    const postBody = JSON.parse(postResult.body);

    const getEvent = {
      httpMethod: 'get',
      path: `/coupons/v1/${postBody.id}`,
    };

    const getResult = await api.handler(getEvent, context);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.id).toEqual(postBody.id);
    expect(getResult.statusCode).toBe(200);
  });    
  

  test('should create 10 coupons then get all coupons', async () => {
    const api = await import('../app/apigateway.mjs');
    
    let postEvent = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {},
    };
    const context = {};

    for (let i = 0; i < 10; i++) {
      postEvent.body = {
        email: `username${i}@domain.com`
      };
      await api.handler(postEvent, context);
      console.log('postEvent', postEvent);
    }

    const getEvent = {
      httpMethod: 'get',
      path: `/coupons/v1/`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.length).toEqual(10);
    expect(getResult.statusCode).toBe(200);
  });    
});
