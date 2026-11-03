import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';

console.log("Enter the path to the ZIP file:");
const zipFilePath = process.argv[2] || 'file.zip';
const extractPath = './extracted/';
const baseExtractPath = path.resolve(extractPath);

fs.createReadStream(zipFilePath)
  .pipe(unzipper.Parse())
  .on('entry', entry => {
    const filePath = path.resolve(baseExtractPath, entry.path);
    const isWithinBasePath =
      filePath === baseExtractPath || filePath.startsWith(baseExtractPath + path.sep);

    if (!isWithinBasePath) {
      console.warn('Skipping unsafe path:', entry.path);
      entry.autodrain();
      return;
    }

    entry.pipe(fs.createWriteStream(filePath));
  })
  .on('error', (err) => {
    console.error('Extraction error:', err);
  })
  .on('finish', () => {
    console.log('Extraction complete.');
  });
