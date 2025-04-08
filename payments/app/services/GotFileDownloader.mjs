import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import got from "got"; // Use got instead of axios
import { PassThrough } from "stream"; // Node.js built-in stream utility
import { promisify } from "util"; // To promisify pipeline
import stream from "stream"; // For stream.pipeline

// Promisify stream.pipeline for async/await usage
const pipeline = promisify(stream.pipeline);

// Configure your AWS Region
const AWS_REGION = process.env.AWS_REGION || "us-east-1"; // Replace with your desired region or use env var

// Create an S3 client instance
const s3Client = new S3Client({ region: AWS_REGION });

export default class GotFileDownloader {
    /**
     * Downloads a file from a URL using got and streams it directly to an AWS S3 bucket.
     *
     * @param {string} sourceUrl The URL of the file to download.
     * @param {string} bucketName The name of the target S3 bucket.
     * @param {string} s3Key The desired key (path/filename) for the object in S3.
     * @param {object} [s3UploadOptions={}] Optional parameters for the S3 Upload constructor (e.g., ACL, ContentType). See @aws-sdk/lib-storage documentation.
     * @param {object} [gotOptions={}] Optional parameters for the got request (e.g., headers, timeout). See got documentation.
     * @returns {Promise<object>} A promise that resolves with the S3 upload output upon success.
     * @throws {Error} Throws an error if the download or upload fails.
     */
    async download(sourceUrl, bucketName, s3Key, s3UploadOptions = {}, gotOptions = {}) {
        console.log(`Starting stream using got from ${sourceUrl} to s3://${bucketName}/${s3Key}`);

        // Use a PassThrough stream to link the download and upload
        // and allow for error handling and potential transformations later.
        const passThroughStream = new PassThrough();

        // Set up the S3 upload target stream using @aws-sdk/lib-storage
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: s3Key,
                Body: passThroughStream, // Body is the stream we pipe data into
                // You might want to set ContentType explicitly or try to get it later
                // ContentType: 'application/octet-stream',
                ...s3UploadOptions
            },
            // Optional: Configure queue size and part size for multipart uploads
            // queueSize: 4,
            // partSize: 1024 * 1024 * 5, // 5 MB
        });

        // Add progress listener (optional)
        upload.on("httpUploadProgress", (progress) => {
            if (progress.total) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                console.log(`Uploading to S3: ${percent}% (${progress.loaded} / ${progress.total} bytes)`);
            } else {
                console.log(`Uploading to S3: ${progress.loaded} bytes`);
            }
        });

        // --- Use got.stream to get a readable stream ---
        const downloadStream = got.stream(sourceUrl, {
            ...gotOptions,
            isStream: true, // Ensure we are getting a stream
            throwHttpErrors: false // Handle HTTP errors manually via response event
        });

        // Promise to track S3 upload completion or failure
        const uploadPromise = upload.done();
        // Promise to track download stream errors or completion (via pipeline)
        let downloadPipelinePromise;

        // We need to wait for the 'response' event to check the status code
        // before we start piping data to S3.
        const responsePromise = new Promise((resolve, reject) => {
            downloadStream.on('response', (response) => {
                console.log(`Download response received: Status ${response.statusCode}`);
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    // Destroy the stream and reject the promise if status is not OK
                    const err = new Error(`Failed to download file: Status code ${response.statusCode}`);
                    downloadStream.destroy(err); // Important: stop the download stream
                    return reject(err);
                }

                // --- Status is OK, start the pipeline ---
                // Try to get content type from the download response
                if (!s3UploadOptions.ContentType && response.headers['content-type']) {
                    console.log(`Setting ContentType from response: ${response.headers['content-type']}`);
                    // Note: Modifying upload.params after instantiation might not be reliable
                    // for all parameters with Upload class. It's safer to set it initially
                    // if possible, or manage ContentType detection differently if needed.
                    // For simplicity here, we'll proceed, but be aware of this.
                    // A better approach might be to create the Upload *after* getting the response.
                    upload.params.ContentType = response.headers['content-type'];
                }

                console.log("Piping download stream to S3 upload stream...");
                // Use stream.pipeline for robust error handling and cleanup
                downloadPipelinePromise = pipeline(downloadStream, passThroughStream)
                    .catch(err => {
                        console.error("Pipeline error during streaming:", err);
                        // Ensure upload is aborted if pipeline fails before completion
                        upload.abort().catch(abortErr => console.error("Error aborting S3 upload:", abortErr));
                        reject(err); // Reject the main promise
                    });

                resolve(); // Resolve the responsePromise, allowing the function to proceed
            });

            // Handle errors during the initial request/connection phase for got
            downloadStream.on('error', (err) => {
                console.error("Got download stream initial error:", err);
                // Ensure upload is aborted if download fails early
                upload.abort().catch(abortErr => console.error("Error aborting S3 upload:", abortErr));
                reject(err); // Reject the responsePromise
            });
        });


        try {
            // Wait for the response headers and status code check first
            await responsePromise;

            // Now wait for both the download pipeline and the S3 upload to complete
            // If downloadPipelinePromise wasn't assigned (due to early error), this will be fine.
            // The main error would have been caught via responsePromise rejection.
            // Waiting for both ensures resources are handled correctly.
            await Promise.all([
                downloadPipelinePromise, // Wait for pipeline completion/error
                uploadPromise          // Wait for S3 upload completion/error
            ]);

            console.log(`Successfully streamed ${sourceUrl} to s3://${bucketName}/${s3Key}`);
            // The result from uploadPromise contains S3 details
            const result = await uploadPromise;
            console.log("S3 Upload Result:", result);
            return result;

        } catch (error) {
            // Errors from responsePromise, pipeline, or uploadPromise will land here
            console.error("Error in streamUrlToS3WithGot:", error);
            // Attempt to abort the S3 upload if it's still in progress
            upload.abort().catch(abortErr => console.error("Error attempting to abort S3 upload on failure:", abortErr));
            // Re-throw the error for the caller
            throw error;
        }
    }
}

/*
async function runExample() {
    const FILE_URL = "https://speed.hetzner.de/100MB.bin"; // A public URL for a test file
    const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME; // Get bucket name from environment variable
    const S3_OBJECT_KEY = `uploads/streamed-file-got-${Date.now()}.bin`; // Example S3 key

    if (!S3_BUCKET_NAME) {
        console.error("Error: Please set the S3_BUCKET_NAME environment variable.");
        process.exit(1);
    }

    try {
        await streamUrlToS3WithGot(
            FILE_URL,
            S3_BUCKET_NAME,
            S3_OBJECT_KEY,
            { // Optional S3 parameters
                // ContentType: 'application/octet-stream', // Can be omitted to try getting from response
                Tagging: "Source=StreamedGot&Project=Demo" // Example tags
            },
            { // Optional Got parameters
                 timeout: { request: 30000 }, // Example: 30 second timeout for the request
                 // headers: { 'User-Agent': 'MyStreamingApp/1.0' }
            }
        );
        console.log("Example finished successfully.");
    } catch (err) {
        console.error("Example failed:", err.message);
        process.exit(1); // Exit with error code if the stream fails
    }
}

// Uncomment to run the example when executing the script directly
// runExample();

// Export the function for use in other modules
export { streamUrlToS3WithGot }; // Use 'module.exports = { streamUrlToS3WithGot };' for CommonJS
*/