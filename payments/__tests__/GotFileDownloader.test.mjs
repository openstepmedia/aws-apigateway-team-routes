/**
 * Usage:
 * npm run test -- GotFileDownloader.test.mjs --resetModules
 */
import GotFileDownloader from '../app/services/GotFileDownloader.mjs';

const ts = Date.now();

describe('GotFileDownloader test', () => {
    test.only('should download file from url as stream', async () => {

        const url = "https://getsamplefiles.com/download/mp4/sample-4.mp4";
        const bucket = process.env.AWS_BUCKET_NAME;
        const key = `test-filedownloadservce/sample_${ts}.mp4`;
            

        const downloader = new GotFileDownloader();
        await downloader.download(url, bucket, key);
        
    }, 20000);

});