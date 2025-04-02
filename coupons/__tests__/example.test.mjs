/**
 * Usage:
 * npm run test -- --resetModules
 */
describe('Example test', () => {
    test('should match object', async () => {
        const obj = { key: 'value' };
        expect(obj).toEqual({ key: 'value' });
    });
});