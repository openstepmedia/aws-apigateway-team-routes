export class FileDownloadService {
  #downloader;
  #storage;

  constructor(downloader, storage) {
    this.#downloader = downloader;
    this.#storage = storage;
  }

  async download(url, destinationKey, downloadOptions = {}, saveOptions = {}) {
    try {
      const fileStream = this.#downloader.download(url, downloadOptions);
      await this.#storage.saveStream(destinationKey, fileStream, saveOptions);
      console.log(`File successfully uploaded to S3 at ${destinationKey}`);
    } catch (error) {
      console.error('Error transferring file:', error);
      throw error;
    }
  }
}