/**
 * Usage:
 * npm run test -- --resetModules
 */
describe('API', () => {
  test('should define a status endpoint', async () => {
    const api = await import('../index');
    const event = {
      httpMethod: 'get',
      path: '/users/v1/status',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    const body = JSON.parse(result.body);

    expect(body).toEqual({ status: 'ok' });
    expect(result.statusCode).toBe(200);
  });

  test('should create user', async () => {
    const api = await import('../index');
    const event = {
      httpMethod: 'post',
      path: '/users/v1',
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
    const api = await import('../index');
    const event = {
      httpMethod: 'post',
      path: '/users/v1',
      body: {},
    };
    const context = {};
    const callback = () => { };    

    const result = await api.handler(event, context, callback);

    expect(result.statusCode).toBe(500);
  });   

  test('should create user then get user', async () => {
    const api = await import('../index');
    const postEvent = {
      httpMethod: 'post',
      path: '/users/v1',
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
      path: `/users/v1/${postBody.id}`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.id).toEqual(postBody.id);
    expect(getResult.statusCode).toBe(200);
  });    
  

  test('should create 10 users then get all users', async () => {
    const api = await import('../index');

    let postEvent = {
      httpMethod: 'post',
      path: '/users/v1',
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
      path: `/users/v1/`,
      body: {},
    };

    const getResult = await api.handler(getEvent, context, callback);
    const getBody = JSON.parse(getResult.body);

    expect(getBody.length).toEqual(10);
    expect(getResult.statusCode).toBe(200);
  });    
});
