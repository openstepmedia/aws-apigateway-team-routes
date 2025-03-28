/**
 * Usage:
 * npm run test -- --resetModules
 */
const api = await import('../app/api.index');

describe('Coupons API', () => {
  test('should define a status endpoint', async () => {
    const event = {
      httpMethod: 'get',
      path: '/coupons/v1/status',
      body: {},
    };
    const context = {};
    const callback = () => { };
    console.log('api:', api);

    const result = await api.handler(event, context, callback);

    const body = JSON.parse(result.body);

    expect(body.status).toEqual('ok');
    expect(result.statusCode).toBe(200);
  });

  test('should create coupons', async () => {
    const event = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {
        email: 'username@domain.com'
      },
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    const body = JSON.parse(result.body);

    expect(body.total).toEqual(event.body.total);
    expect(result.statusCode).toBe(200);
  });

  test('should fail create user', async () => {
    const event = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

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
    const callback = () => { };    

    const postResult = await api.handler(postEvent, context, callback);
    const postBody = JSON.parse(postResult.body);

    const getEvent = {
      httpMethod: 'get',
      path: `/coupons/v1/${postBody.id}`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.id).toEqual(postBody.id);
    expect(getResult.statusCode).toBe(200);
  });    
  

  test('should create 10 coupons then get all coupons', async () => {
    const api = await import('../app/api.index');

    let postEvent = {
      httpMethod: 'post',
      path: '/coupons/v1',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    for (let i = 0; i < 10; i++) {
      postEvent.body = {
        email: `username${i}@domain.com`
      };
      await api.handler(postEvent, context, callback);
      console.log('postEvent', postEvent);
    }

    const getEvent = {
      httpMethod: 'get',
      path: `/coupons/v1/`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.length).toEqual(10);
    expect(getResult.statusCode).toBe(200);
  });    
});
