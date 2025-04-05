// storage-service.mjs
import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'

export class S3StorageService {
  #storage;

  constructor(config) {
    const s3Driver = new S3Driver({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      },
      region: config.region,
      bucket: config.bucket
    });
    this.#storage = new Disk(s3Driver);
  }

  async putStream(key, stream, options = {}) {
    const defaultOptions = {
        ContentType: 'application/octet-stream',
        Metadata: {}
    };

    // Merge default options with user-provided options
    options = { ...defaultOptions, ...options };

    await this.#storage.putStream(key, stream, options);
  }
}

// Named export for interface-like usage
export const StorageService = {
    putStream: async (key, stream, options) => {}
};