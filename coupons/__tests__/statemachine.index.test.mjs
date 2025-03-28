/**
 * Usage:
 * npm run test -- statemachine.index.test.mjs
 */
const api = await import('../app/statemachine');

describe('Coupons API', () => {
  test.only('should execute state1', async () => {
    const event = {
      httpMethod: 'post',
      path: '/coupons/v1/state1',
      body: {
        input: {
          inputFile: 'input.json',
        },
        output: {},
      },
    };
    const context = {
      awsRequestId: 'statemachine.' + Date.now()
    };
    const callback = () => { };
    const result = await api.handler(event, context, callback);


    event.path = '/coupons/v1/state2';
    event.body = result;
    const result2 = await api.handler(event, context, callback);

    console.log('result', JSON.stringify(result, null, 2));
    console.log('event2', JSON.stringify(event, null, 2));
    console.log('result2', JSON.stringify(result2, null, 2));

    process.exit();

    expect(body.input).toEqual(event.body.input);
    expect(body.output.state1Value).toEqual({
      key: 'state1',
      time: expect.any(Number),
    });
  });

  test('should execute state2', async () => {
    const event = {
      httpMethod: 'post',
      headers: {
        'x-forwarded-for': 'statemachine',
      },
      path: '/coupons/v1/state2',
      body: {
        input: {
          inputFile: 'input.json',
        },
        output: {},
      },
    };
    const context = {
      awsRequestId: 'statemachine.123457'
    };
    const callback = () => { };
    const result = await api.handler(event, context, callback);
    const body = JSON.parse(result.body);

    expect(body.input).toEqual(event.body.input);
    expect(body.output.state1Value).toEqual({
      key: 'state2',
      time: expect.any(Number),
    });
  });

});
