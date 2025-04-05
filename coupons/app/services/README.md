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