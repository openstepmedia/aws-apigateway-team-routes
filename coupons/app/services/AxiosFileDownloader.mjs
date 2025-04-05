import axios from "axios";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream"; // Node.js built-in stream utility

// Configure your AWS Region
const AWS_REGION = process.env.AWS_REGION || "us-east-1"; // Replace with your desired region or use env var

// Create an S3 client instance
const s3Client = new S3Client({ region: AWS_REGION });

export default class AxiosFileDownloader {

    /**
     * Downloads a file from a URL and streams it directly to an AWS S3 bucket.
     *
     * @param {string} sourceUrl The URL of the file to download.
     * @param {string} bucketName The name of the target S3 bucket.
     * @param {string} s3Key The desired key (path/filename) for the object in S3.
     * @param {object} [s3UploadOptions={}] Optional parameters for the S3 Upload constructor (e.g., ACL, ContentType). See @aws-sdk/lib-storage documentation.
     * @param {object} [axiosOptions={}] Optional parameters for the axios request (e.g., headers).
     * @returns {Promise<object>} A promise that resolves with the S3 upload output upon success.
     * @throws {Error} Throws an error if the download or upload fails.
     */
    async download(sourceUrl, bucketName, s3Key, s3UploadOptions = {}, axiosOptions = {}) {
        console.log(`Starting stream from ${sourceUrl} to s3://${bucketName}/${s3Key}`);

        try {
            // 1. Initiate the download stream using axios
            const response = await axios({
                method: 'get',
                url: sourceUrl,
                responseType: 'stream', // Crucial: Get the response as a ReadableStream
                ...axiosOptions,
            });

            // Check if the download request was successful
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Failed to download file: Status code ${response.status}`);
            }

            const downloadStream = response.data; // This is the ReadableStream

            // 2. Create a PassThrough stream
            // This acts as a bridge and helps manage backpressure and error handling between
            // the download stream and the S3 upload stream.
            const passThroughStream = new PassThrough();

            // Pipe the download stream into the PassThrough stream
            // Error handling on the download stream is important here
            downloadStream.on('error', (err) => {
                console.error("Download stream error:", err);
                passThroughStream.emit('error', err); // Propagate error to the PassThrough stream
            });
            downloadStream.pipe(passThroughStream);

            // 3. Set up the S3 upload using @aws-sdk/lib-storage
            // The 'Upload' class efficiently handles streaming data, including multipart uploads for larger files.
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: bucketName,
                    Key: s3Key,
                    Body: passThroughStream, // Pipe the PassThrough stream to S3
                    // --- Optional common parameters ---
                    // ContentType: response.headers['content-type'] || 'application/octet-stream', // Get Content-Type from source if available
                    // ACL: 'private', // Adjust permissions as needed e.g., 'public-read'
                    ...s3UploadOptions // Allow overriding/adding S3 params
                },
                // Optional: Configure queue size and part size for multipart uploads
                // queueSize: 4, // Default is 4
                // partSize: 1024 * 1024 * 5, // Default is 5MB
            });

            // Optional: Log upload progress
            upload.on("httpUploadProgress", (progress) => {
                if (progress.total) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    console.log(`Uploading to S3: ${percent}% (${progress.loaded} / ${progress.total} bytes)`);
                } else {
                    console.log(`Uploading to S3: ${progress.loaded} bytes`);
                }
            });

            // 4. Start the upload and wait for it to complete
            console.log("Starting S3 upload...");
            const result = await upload.done();
            console.log(`Successfully streamed ${sourceUrl} to s3://${bucketName}/${s3Key}`);
            console.log("S3 Upload Result:", result); // { ETag, Location, Key, Bucket, ... }
            return result;

        } catch (error) {
            console.error("Error streaming file to S3:", error);

            // More specific error checking
            if (axios.isAxiosError(error)) {
                console.error("Axios error details:", error.response?.status, error.response?.data);
            } else if (error.name === 'CredentialsProviderError') {
                console.error("AWS Credentials Error. Check your configuration (env vars, ~/.aws/credentials, IAM role).");
            } else if (error.$metadata?.httpStatusCode) {
                console.error("S3 API Error:", error.name, `(HTTP ${error.$metadata.httpStatusCode})`);
            }

            // Re-throw the error so the caller can handle it
            throw error;
        }
    }
}
