## Downloaders

Example usage of AxiosFileDownloader

```

const url = "https://getsamplefiles.com/download/mp4/sample-4.mp4";
const bucket = process.env.AWS_BUCKET_NAME;
const key = `test-filedownloadservce/sample_${ts}.mp4`;

const downloader = new AxiosFileDownloader();
await downloader.download(url, bucket, key);

try {
    await streamUrlToS3(
        FILE_URL,
        S3_BUCKET_NAME,
        S3_OBJECT_KEY,
        { // Optional S3 parameters
            ContentType: 'application/octet-stream', // Explicitly set content type
            Tagging: "Source=Streamed&Project=Demo"   // Example tags
        },
        { // Optional Axios parameters
            // headers: { 'Authorization': 'Bearer YOUR_TOKEN' } // Example if URL needs auth
        }
    );
    console.log("Example finished successfully.");
} catch (err) {
    console.error("Example failed:", err.message);
    process.exit(1); // Exit with error code if the stream fails
}

```

# State Manager Service

Here's what each artifact contains:

1. **State Manager Service**: The core implementation that follows SOLID principles:
   - `StateStorageStrategy`: Interface defining storage operations
   - `FlyDriveStorageStrategy`: Concrete implementation using flydrive
   - `StateManager`: Main service that delegates to the storage strategy
   - `StateManagerFactory`: Factory to create appropriately configured instances

2. **.env.example**: Sample environment configuration file showing available options.

3. **package.json**: Dependencies and project configuration.

4. **Example Usage**: A script demonstrating how to use the state manager.

The implementation follows these SOLID principles:

- **Single Responsibility**: Each class has a single purpose (storage, management, factory creation)
- **Open/Closed**: The system is open for extension (new storage strategies) but closed for modification
- **Liskov Substitution**: Any `StateStorageStrategy` can be used interchangeably
- **Interface Segregation**: Clean interfaces with focused methods
- **Dependency Inversion**: High-level modules depend on abstractions, not concrete implementations

To get started:
1. Create a `.env` file (based on the example)
2. Install dependencies with `npm install`
3. Import and use the StateManager as shown in the example

## Example Usage 

```
// example.js
import { StateManagerFactory } from './stateManager.js';

async function main() {
  try {
    // Create a state manager instance
    const stateManager = await StateManagerFactory.create();
    
    // Example user state
    const userState = {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        theme: 'dark',
        notifications: true
      },
      lastLogin: new Date().toISOString()
    };
    
    // Save state
    console.log('Saving user state...');
    await stateManager.saveState('user123', userState);
    
    // Check if state exists
    const exists = await stateManager.hasState('user123');
    console.log(`State exists: ${exists}`);
    
    // Load state
    console.log('Loading user state...');
    const loadedState = await stateManager.loadState('user123');
    console.log(loadedState);
    
    // Update state partially
    console.log('Updating user state...');
    const updatedState = await stateManager.updateState('user123', {
      preferences: {
        ...loadedState.preferences,
        theme: 'light'
      },
      lastLogin: new Date().toISOString()
    });
    console.log(updatedState);
    
    // Delete state
    // Uncomment to test deletion
    // console.log('Deleting user state...');
    // await stateManager.deleteState('user123');
    // const stillExists = await stateManager.hasState('user123');
    // console.log(`State still exists: ${stillExists}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```
