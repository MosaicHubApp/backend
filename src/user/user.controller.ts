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
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserInterestsDto } from './dto/user-interests.dto';
import type { UserRequest } from '../common/interfaces/user.request';
import { UserUpdateDto } from './dto/user-update.dto';
// @ts-ignore
import type { File } from 'multer';
import { getFullUrl } from '../common/utils/request.util';
import { createImageFileInterceptor } from '../common/utils/image.util';
import { AVATARS_DIRECTORY } from './user.constants';
import { withFileCleanup } from '../common/utils/file.util';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all-interests')
  getAllInterests() {
    return this.userService.getAllInterests();
  }

  @Put('interests')
  updateUserInterests(@Req() req: UserRequest, @Body() dto: UserInterestsDto) {
    return this.userService.updateUserInterests(
      req.user.userId,
      dto.interestIds,
    );
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
  @UseInterceptors(createImageFileInterceptor(AVATARS_DIRECTORY))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async updateUserAvatar(@Req() req: UserRequest, @UploadedFile() file: File) {
    return withFileCleanup(file, () =>
      this.userService.updateUserAvatar(req.user.userId, getFullUrl(req), file.path),
    );
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