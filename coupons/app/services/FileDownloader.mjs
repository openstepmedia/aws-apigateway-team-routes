import download from 'download';

// file-downloader.mjs
export class HttpFileDownloader {
  download(url, destination = null, options = {}) {
    return download(url, destination, options);
  }
}

// Named export for interface-like usage
export const FileDownloader = {
  download: (url, options) => { }
};