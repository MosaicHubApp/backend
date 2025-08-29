import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserInterestsDto } from './dto/user-interests.dto';
import type { UserRequest } from '../interfaces/user.request';

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

}