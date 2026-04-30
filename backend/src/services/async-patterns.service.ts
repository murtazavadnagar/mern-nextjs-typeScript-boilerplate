import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs/promises';

const readFileWithCallback = (filePath: string, callback: (error: NodeJS.ErrnoException | null, data?: string) => void): void => {
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      callback(error);
      return;
    }

    callback(null, data);
  });
};

const readFileAsPromise = promisify(fs.readFile);

export class AsyncPatternsService {
  private readonly filePath = path.join(process.cwd(), 'package.json');

  callbackPattern(): Promise<string> {
    return new Promise((resolve, reject) => {
      readFileWithCallback(this.filePath, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data ?? '');
      });
    });
  }

  async promisePattern(): Promise<string> {
    const data = await readFileAsPromise(this.filePath, 'utf8');
    return data.toString();
  }

  async asyncAwaitPattern(): Promise<string> {
    return readFile(this.filePath, 'utf8');
  }
}
