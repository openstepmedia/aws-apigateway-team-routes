/**
 * Usage:
 * npm run test -- --resetModules
 */
describe('API', () => {
  test('should define a status endpoint', async () => {
    const api = await import('../index');
    const event = {
      httpMethod: 'get',
      path: '/orders/v1/status',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    const body = JSON.parse(result.body);

    expect(body).toEqual({ status: 'ok' });
    expect(result.statusCode).toBe(200);
  });

  test('should create order', async () => {
    const api = await import('../index');
    const event = {
      httpMethod: 'post',
      path: '/orders/v1',
      body: {
        total: 100
      },
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    const body = JSON.parse(result.body);

    expect(body.total).toEqual(event.body.total);
    expect(result.statusCode).toBe(200);
  });

  test('should fail create order', async () => {
    const api = await import('../index');
    const event = {
      httpMethod: 'post',
      path: '/orders/v1',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    expect(result.statusCode).toBe(500);
  });   

  test('should create order then get order', async () => {
    const api = await import('../index');
    const postEvent = {
      httpMethod: 'post',
      path: '/orders/v1',
      body: {
        total: 100
      },
    };
    const context = {};
    const callback = () => { };    

    const postResult = await api.handler(postEvent, context, callback);
    const postBody = JSON.parse(postResult.body);

    const getEvent = {
      httpMethod: 'get',
      path: `/orders/v1/${postBody.id}`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.id).toEqual(postBody.id);
    expect(getResult.statusCode).toBe(200);
  });    
  

  test('should create 10 orders then get all orders', async () => {
    const api = await import('../index');

    let postEvent = {
      httpMethod: 'post',
      path: '/orders/v1',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    for (let i = 0; i < 10; i++) {
      postEvent.body = {
        total: 100 + i
      };
      await api.handler(postEvent, context, callback);
    }

    const getEvent = {
      httpMethod: 'get',
      path: `/orders/v1/`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.length).toEqual(10);
    expect(getResult.statusCode).toBe(200);
  });    
});
