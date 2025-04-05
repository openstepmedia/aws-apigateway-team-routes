import axios from "axios";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream"; // Node.js built-in stream utility
import unzipper from 'unzipper'; // Import the unzipper library
import path from 'path'; // Node.js path utility for joining keys correctly

// Configure your AWS Region
const AWS_REGION = process.env.AWS_REGION || "us-east-1"; // Replace with your desired region or use env var

// Create an S3 client instance
const s3Client = new S3Client({ region: AWS_REGION });

export default class AxiosFileDownloader {

    /**
     * Downloads a file from a URL and streams it directly to an AWS S3 bucket.
     * If the sourceUrl ends with '.zip', it decompresses the archive and uploads
     * each file individually to S3 under the specified s3Key (treated as a prefix/directory).
     *
     * @param {string} sourceUrl The URL of the file to download. Must end with '.zip' for decompression.
     * @param {string} bucketName The name of the target S3 bucket.
     * @param {string} s3Key The desired key (path/filename) for the object in S3.
     * If sourceUrl is a ZIP file, this key acts as a base directory/prefix
     * under which the extracted files will be stored.
     * @param {object} [s3UploadOptions={}] Optional parameters for the S3 Upload constructor
     * (e.g., ACL, ContentType). Applied to each uploaded file if ZIP.
     * @param {object} [axiosOptions={}] Optional parameters for the axios request (e.g., headers).
     * @returns {Promise<object|Array<object>>} A promise that resolves with:
     * - The S3 upload output object (if not a ZIP).
     * - An array of S3 upload output objects for each extracted file (if a ZIP).
     * @throws {Error} Throws an error if the download, decompression, or upload fails.
     */
    async download(sourceUrl, bucketName, s3Key, s3UploadOptions = {}, axiosOptions = {}) {
        console.log(`Starting download from ${sourceUrl}`);

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

            // --- Check if the source URL indicates a ZIP file ---
            if (sourceUrl.toLowerCase().endsWith('.zip')) {
                console.log(`Detected ZIP file. Decompressing and uploading contents to s3://${bucketName}/${s3Key}/`);

                const uploadPromises = []; // Store promises for each file upload

                // Pipe the download stream into the unzipper
                const unzipStream = downloadStream.pipe(unzipper.Parse({ forceStream: true }));

                // Process each entry (file/directory) in the ZIP archive
                for await (const entry of unzipStream) {
                    const entryPath = entry.path;
                    const type = entry.type; // 'Directory' or 'File'

                    if (type === 'File') {
                        // Construct the S3 key for the individual file
                        // Treats the original s3Key as a base directory/prefix
                        const individualS3Key = path.join(s3Key, entryPath);
                        console.log(`   Uploading extracted file: ${entryPath} to s3://${bucketName}/${individualS3Key}`);

                        // Create a *separate* S3 upload for each file entry
                        // The 'entry' itself is a readable stream of the file content
                        const upload = new Upload({
                            client: s3Client,
                            params: {
                                Bucket: bucketName,
                                Key: individualS3Key,
                                Body: entry, // Stream the entry content directly
                                // --- Optional common parameters ---
                                // You might want to try and determine ContentType based on file extension here
                                // ContentType: 'application/octet-stream', // Default or determine dynamically
                                ...s3UploadOptions // Apply common options
                            },
                        });

                        // Add the promise returned by upload.done() to the array
                        uploadPromises.push(
                            upload.done().then(result => {
                                console.log(`   Successfully uploaded ${entryPath} to s3://${bucketName}/${individualS3Key}`);
                                return result; // Return the result for Promise.all
                            }).catch(err => {
                                console.error(`   Error uploading ${entryPath}:`, err);
                                // Re-throw to make Promise.all fail if any upload fails
                                throw new Error(`Failed to upload ${entryPath}: ${err.message}`);
                            })
                        );

                    } else {
                        // Handle directories if needed (e.g., create empty objects in S3)
                        // S3 doesn't really have directories, but creating an object ending in '/'
                        // can simulate this in many S3 browser tools.
                        // For now, we just drain the stream for directories to continue processing.
                        console.log(`   Skipping directory: ${entryPath}`);
                        entry.autodrain();
                    }
                }

                // Wait for all individual file uploads within the ZIP to complete
                console.log("Waiting for all ZIP contents uploads to complete...");
                const results = await Promise.all(uploadPromises);
                console.log(`Successfully extracted and uploaded contents from ${sourceUrl} to s3://${bucketName}/${s3Key}/`);
                return results; // Return an array of S3 upload results

            } else {
                // --- Original behavior: Stream directly to S3 (non-ZIP file) ---
                console.log(`Streaming non-ZIP file directly to s3://${bucketName}/${s3Key}`);

                // 2. Create a PassThrough stream
                const passThroughStream = new PassThrough();

                // Pipe the download stream into the PassThrough stream
                downloadStream.on('error', (err) => {
                    console.error("Download stream error:", err);
                    passThroughStream.emit('error', err); // Propagate error
                });
                downloadStream.pipe(passThroughStream);

                // 3. Set up the S3 upload using @aws-sdk/lib-storage
                const upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: bucketName,
                        Key: s3Key,
                        Body: passThroughStream,
                        // --- Optional common parameters ---
                        // ContentType: response.headers['content-type'] || 'application/octet-stream',
                        ...s3UploadOptions
                    },
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
                console.log("S3 Upload Result:", result);
                return result; // Return the single S3 upload result
            }

        } catch (error) {
            console.error("Error during download/upload process:", error);

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