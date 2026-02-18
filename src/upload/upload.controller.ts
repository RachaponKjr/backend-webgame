import {
  Controller,
  Post,
  UseInterceptors,
  Req,
  Query,
  MaxFileSizeValidator,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as express from 'express'; // ใช้ namespace เพื่อแก้ปัญหา isolatedModules
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller(`upload`)
export class UploadController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'path', required: false })
  @ApiOperation({ summary: 'อัปโหลดรูปภาพแยกตามโฟลเดอร์' })
  @ApiBody({
    description: 'อัปโหลดรูปภาพ',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = (req.query.path as string) || 'default';
          const fullPath = join('./uploads', uploadPath);
          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
          }
          callback(null, fullPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: express.Request,
    @Query('path') pathQuery: string,
  ) {
    const protocol = req.protocol;
    const host = req.get('host');
    const subPath = pathQuery || 'default';
    const fileUrl = `${protocol}://${host}/public/${subPath}/${file.filename}`;

    return {
      status: true,
      message: 'Upload success!',
      filename: file.filename,
      path: subPath,
      url: fileUrl,
    };
  }
}
