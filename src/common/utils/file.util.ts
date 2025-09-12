import path from 'node:path';
import { FILE_NOT_FOUND_ERROR_CODE, UPLOADS_DIRECTORY } from '../constants';
import { promises as fs } from 'fs';

export async function deleteFile(directory: string, fileName: string) {
  const filePath = path.join(
    process.cwd(),
    UPLOADS_DIRECTORY,
    directory,
    fileName,
  );
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== FILE_NOT_FOUND_ERROR_CODE) {
      throw error;
    }
  }
}

export async function withFileCleanup<T>(
  file: Express.Multer.File,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (file?.path) {
      await fs.unlink(file.path).catch(() => {});
    }
    throw error;
  }
}
