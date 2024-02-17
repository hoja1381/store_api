import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageStorageService {
  async save(file: Express.Multer.File): Promise<string> {
    let fileName: string = uuid();

    const mb = 5;
    const bytes = mb * 1000000;
    if (file.size > bytes)
      throw new BadRequestException(`the image should be less than ${mb} MB.`);

    if (file.mimetype.split('/')[0] == 'image') {
      fileName += '.png';
    } else {
      throw new BadRequestException('the file should be an image.');
    }

    try {
      const filePath = join(process.cwd(), 'images', fileName);
      writeFileSync(filePath, file.buffer);
      return fileName;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async delete(filePath: string) {
    try {
      unlinkSync(`./images/${filePath}`);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
