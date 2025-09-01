import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Post,
  Param, Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserInterestsDto } from './dto/user-interests.dto';
import type { UserRequest } from '../interfaces/user.request';
import { UserUpdateDto } from './dto/user-update.dto';
// @ts-ignore
import type { File } from 'multer';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get('all-interests')
  getAllInterests() {
    return this.userService.getAllInterests();
  }

  @Put('interests')
  updateUserInterests(@Req() req: UserRequest, @Body() dto: UserInterestsDto) {
    return this.userService.updateUserInterests(req.user.userId, dto.interestIds);
  }

  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Req() req: UserRequest, @Body() dto: UserUpdateDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  uploadAvatar(@UploadedFile() file: File, @Req() req: UserRequest) {
    return this.userService.updateUserAvatar(req.user.userId, file.filename);
  }

  @Post(':userId/ban')
  banUser(@Req() req: UserRequest, @Param('userId') userIdToBan: number) {
    return this.userService.banUser(req.user.userId, userIdToBan);
  }

  @Delete(':userId/ban')
  unbanUser(@Req() req: UserRequest, @Param('userId') userIdToUnban: number) {
    return this.userService.unbanUser(req.user.userId, userIdToUnban);
  }

  @Get('banned-users')
  getBannedUsers(@Req() req: UserRequest) {
    return this.userService.getBannedUsers(req.user.userId);
  }
}