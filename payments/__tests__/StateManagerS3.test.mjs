/**
 * Usage:
 * npm run test -- StateManagerS3.test.mjs
 */


import { StateManagerFactory } from '../app/services/StateManager.mjs';
import { S3Driver } from 'flydrive/drivers/s3'
import { FSDriver } from 'flydrive/drivers/fs';


describe('StateManager', () => {
    test('should return local storage driver', async () => {
        process.env.STORAGE_TYPE = 's3';
        const stateManager = await StateManagerFactory.create();
        const driverType = (stateManager.storageStrategy.storage.driver instanceof S3Driver);
        expect(driverType).toBe(true);
    });

    test('should save state to local driver', async () => {
        process.env.STORAGE_TYPE = 's3';
        const stateManager = await StateManagerFactory.create();

        const paymentState = {
            id: 'payment123',
            status: 'pending',
            amount: 100,
        };
        await stateManager.saveState('payment123', paymentState);

        const loadedState = await stateManager.loadState('payment123');

        expect(loadedState).toEqual(paymentState);
    });    
});