/**
 * Usage:
 * npm run test -- statemachine.index.test.mjs
 */
import { handler } from '../app/statemachine.mjs';

describe('Payments Statemachine', () => {
  /**
   * Simulate a simple statemachine that has 2 states
   */
  test('should execute state1 followed by state2', async () => {
    const event = {};

    const context = {
      awsRequestId: 'statemachine.' + Date.now()
    };

    const input = {
      input: {
        inputFile: 'input.json',
      }
    };

    /**
     * Simulate a new request to state1
     */
    event.path = '/payments/v1/state1';
    event.body = input;
    const result1 = await handler(event, context);
    console.debug('result1', result1);

    /**
     * Simulate a new request to state2
     */
    event.path = '/payments/v1/state2';
    event.body = result1;
    const result2 = await handler(event, context);
    console.debug('result2', result2);

    expect(result2.output.state1Value).toEqual({
      key: 'state1',
      time: expect.any(Number),
    });

    expect(result2.output.state2Value).toEqual({
      key: 'state2',
      time: expect.any(Number),
    });

  });

});
