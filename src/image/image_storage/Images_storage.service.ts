import { Injectable } from '@nestjs/common';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageStorageService {
  async save(file: Express.Multer.File): Promise<string> {
    let fileName: string = uuid();
    if (file.mimetype.split('/')[0] == 'image') {
      fileName += '.png';
    }
    try {
      const filePath = join(process.cwd(), 'uploads', fileName);
      writeFileSync(filePath, file.buffer);
      return filePath;
    } catch (err) {
      return null;
    }
  }

  async delete(filePath: string) {
    try {
      unlinkSync(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }
}
