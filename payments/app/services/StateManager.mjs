// stateManager.js
import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'
import { FSDriver } from 'flydrive/drivers/fs';
import fs from 'fs/promises';
import path from 'path';

// State Storage Strategy Interface
class StateStorageStrategy {
    /**
     * Save state to storage
     * @param {string} key - The state identifier
     * @param {Object} state - The state object to save
     * @returns {Promise<void>}
     */
    async saveState(key, state) {
        throw new Error('Method saveState must be implemented');
    }

    /**
     * Load state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<Object>} The state object
     */
    async loadState(key) {
        throw new Error('Method loadState must be implemented');
    }

    /**
     * Check if state exists
     * @param {string} key - The state identifier
     * @returns {Promise<boolean>}
     */
    async hasState(key) {
        throw new Error('Method hasState must be implemented');
    }

    /**
     * Delete state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<void>}
     */
    async deleteState(key) {
        throw new Error('Method deleteState must be implemented');
    }
}

// FlyDrive Storage Strategy Implementation
class FlyDriveStorageStrategy extends StateStorageStrategy {
    /**
     * @param {Storage} storage - Flydrive storage instance
     * @param {string} basePath - Base path for storing state files
     */
    constructor(storage, basePath = 'states') {
        super();
        this.storage = storage;
        this.basePath = basePath;
    }

    /**
     * Get the full path for a state file
     * @param {string} key - The state identifier
     * @returns {string} Full path
     */
    getPath(key) {
        return `${this.basePath}/${key}.json`;
    }

    /**
     * Save state to storage
     * @param {string} key - The state identifier
     * @param {Object} state - The state object to save
     * @returns {Promise<void>}
     */
    async saveState(key, state) {
        const filePath = this.getPath(key);
        const content = JSON.stringify(state, null, 2);

        await this.storage.put(filePath, content);
    }

    /**
     * Load state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<Object>} The state object
     */
    async loadState(key) {
        const filePath = this.getPath(key);

        if (!(await this.hasState(key))) {
            return null;
        }

        const content = await this.storage.get(filePath);
        return JSON.parse(content.toString());
    }

    /**
     * Check if state exists
     * @param {string} key - The state identifier
     * @returns {Promise<boolean>}
     */
    async hasState(key) {
        const filePath = this.getPath(key);
        try {
            const exists = await this.storage.exists(filePath);
            return exists;
        } catch (error) {
            return false;
        }
    }

    /**
     * Delete state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<void>}
     */
    async deleteState(key) {
        const filePath = this.getPath(key);

        if (await this.hasState(key)) {
            await this.storage.delete(filePath);
        }
    }
}

// State Manager Class (Main Service)
class StateManager {
    /**
     * @param {StateStorageStrategy} storageStrategy - The storage strategy to use
     */
    constructor(storageStrategy) {
        this.storageStrategy = storageStrategy;
    }

    /**
     * Save state to storage
     * @param {string} key - The state identifier
     * @param {Object} state - The state object to save
     * @returns {Promise<void>}
     */
    async saveState(key, state) {
        return this.storageStrategy.saveState(key, state);
    }

    /**
     * Load state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<Object>} The state object
     */
    async loadState(key) {
        return this.storageStrategy.loadState(key);
    }

    /**
     * Check if state exists
     * @param {string} key - The state identifier
     * @returns {Promise<boolean>}
     */
    async hasState(key) {
        return this.storageStrategy.hasState(key);
    }

    /**
     * Delete state from storage
     * @param {string} key - The state identifier
     * @returns {Promise<void>}
     */
    async deleteState(key) {
        return this.storageStrategy.deleteState(key);
    }

    /**
     * Update specific properties in the state
     * @param {string} key - The state identifier
     * @param {Object} partialState - Partial state to merge with existing state
     * @returns {Promise<Object>} Updated state
     */
    async updateState(key, partialState) {
        const currentState = await this.loadState(key) || {};
        const updatedState = { ...currentState, ...partialState };
        await this.saveState(key, updatedState);
        return updatedState;
    }
}

// Factory for creating the appropriate storage strategy
class StateManagerFactory {
    /**
     * Create a new StateManager with the appropriate storage strategy
     * @returns {Promise<StateManager>} A configured StateManager
     */
    static async create() {
        const storageType = process.env.STORAGE_TYPE || 'local';
        const statesPath = process.env.STATES_PATH || 'states';

        // Ensure the states directory exists for local storage
        if (storageType === 'local') {
            try {
                await fs.mkdir(statesPath, { recursive: true });
            } catch (error) {
                console.error(`Error creating states directory: ${error.message}`);
            }
        }

        let driver = null;
        let basePath = '';

        if (storageType === 's3') {

            driver = new S3Driver({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: process.env.AWS_REGION,
                bucket: process.env.AWS_S3_STATE_BUCKET,
                visibility: 'private',
            });

            basePath = statesPath;

        } else {
            
            const root = process.env.LOCAL_STORAGE_PATH || path.resolve(process.cwd(), statesPath);

            driver = new FSDriver({
                location: new URL(root, import.meta.url),
            });
        }

        const storage = new Disk(driver);
        const storageStrategy = new FlyDriveStorageStrategy(storage, basePath);
        return new StateManager(storageStrategy);
    }
}

export { StateManager, StateManagerFactory };