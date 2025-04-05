/**
 * Usage:
 * npm run test -- AxiosFileDownloader.test.mjs --resetModules
 */
import AxiosFileDownloader from '../app/services/AxiosFileDownloader.mjs';

const ts = Date.now();

describe('AxiosFileDownloader test', () => {
    test('should download file from url as stream', async () => {

        const url = "https://getsamplefiles.com/download/mp4/sample-4.mp4";
        const bucket = process.env.AWS_BUCKET_NAME;
        const key = `test-filedownloadservce/sample_${ts}.mp4`;
            

        const downloader = new AxiosFileDownloader();
        await downloader.download(url, bucket, key);
        
    }, 20000);

    test.only('should download file from url as stream and unzip', async () => {

        const url = "https://getsamplefiles.com/download/zip/sample-2.zip";
        const bucket = process.env.AWS_BUCKET_NAME;
        const key = `test-filedownloadservce/zip_extract_${ts}`;
            

        const downloader = new AxiosFileDownloader();
        await downloader.download(url, bucket, key);
        
    }, 20000);


    
});