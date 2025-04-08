/**
 * Usage:
 * npm run test -- FileDownloadService.test.mjs --resetModules
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import download from 'download';
import { S3StorageService } from '../app/services/StorageService.mjs';
import { HttpFileDownloader } from '../app/services/FileDownloader.mjs';
import { FileDownloadService } from '../app/services/FileDownloadService.mjs';
import { url } from 'node:inspector';

const ts = Date.now();
const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME
};

describe('FileDownloadService test', () => {
    test.only('should download file from url as stream', async () => {
        const url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        const dir = './__tests__/';
        const destination = dir;
        const options = {
            timeout: 30000,
            filename: `BigBuckBunny_${ts}.mp4`,
        };

        // const stream = download(url, destination, options);

        const storage = new S3StorageService(s3Config);
        await storage.putStream(`filedownloadservice/${options.filename}`, download(url, destination, options));

        // expect(fs.existsSync(path.join(dir,options.filename))).toBeTruthy();

    }, 20000);

    test('should download file from url', async () => {
        const url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        const dir = './__tests__/';
        const destination = dir;
        const options = {
            timeout: 30000,
            filename: `BigBuckBunny_${ts}.mp4`,
        };

        await download(url, destination, options);

        expect(fs.existsSync(path.join(dir,options.filename))).toBeTruthy();

    }, 20000);


    test('should save stream to s3', async () => {

        const dir = './__tests__/';
        const key = `${ts}.txt`
        const contents = 'Hello world'
        fs.writeFileSync(path.join(dir, key), contents)

        const storage = new S3StorageService(s3Config);
        await storage.putStream(`filedownloadservice/${key}`, fs.createReadStream(path.join(dir, key)));
    });


    test('should match object', async () => {
        const fileUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        const s3Key = `downloads/BigBuckBunny_${ts}.mp4`;

        // Dependency injection
        const storage = new S3StorageService(s3Config);
        const downloader = new HttpFileDownloader();
        const downloadService = new FileDownloadService(downloader, storage);

        const timeout = {timeout: 30000};
        const options = {
            contentType: 'video/mp4',
            'x-amz-decoded-content-length': 123456,
            metadata: { source: 'example.com' }
        };

        try {
            await downloadService.download(fileUrl, s3Key, timeout, options);
            console.log('File downloaded and saved successfully.');
        } catch (error) {
            console.error('Operation failed:', error);
        }

        /*
        const obj = { key: 'value' };
        expect(obj).toEqual({ key: 'value' });
        */
    }, 10000);
});