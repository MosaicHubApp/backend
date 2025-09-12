import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { PostService } from './post.service';
import type { UserRequest } from '../common/interfaces/user.request';
import { CreatePostDto } from './dto/create-post.dto';
// @ts-ignore
import { type File } from 'multer';
import { getFullUrl } from '../common/utils/request.util';
import { PostPhotoRequestDto } from './dto/post-photo-request.dto';
import { createImageFileInterceptor } from '../common/utils/image.util';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostPhotosReorderRequestDto } from './dto/post-photos-reorder-request.dto';
import { POST_PHOTOS_DIRECTORY } from './post.constants';
import { withFileCleanup } from '../common/utils/file.util';

@Controller('post')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @ApiQuery({ name: 'name', required: false, type: String })
  @Get('tags')
  getTags(@Query('name') name: string | null) {
    return this.postService.getTags(name);
  }

  @Post()
  createPost(@Req() req: UserRequest, @Body() dto: CreatePostDto) {
    return this.postService.createPost(req.user.userId, dto);
  }

  @Post('photo')
  @UseInterceptors(createImageFileInterceptor(POST_PHOTOS_DIRECTORY))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        orderNumber: { type: 'number', example: 0 },
        postId: { type: 'number', example: 0 },
      },
    },
  })
  async uploadPostPhoto(
    @UploadedFile() file: File,
    @Req() req: UserRequest,
    @Body() dto: PostPhotoRequestDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    return withFileCleanup(file, () =>
      this.postService.uploadPostPhoto(
        req.user.userId,
        getFullUrl(req),
        file.path,
        file.filename,
        +dto.orderNumber,
        dto.postId ? +dto.postId : undefined,
      ),
    );
  }

  @Put(':postId')
  updatePost(
    @Req() req: UserRequest,
    @Body() dto: UpdatePostDto,
    @Param('postId') postId: number,
  ) {
    return this.postService.updatePost(req.user.userId, postId, dto);
  }

  @Put('photo/reorder')
  updatePhotosOrder(
    @Req() req: UserRequest,
    @Body() dto: PostPhotosReorderRequestDto,
  ) {
    return this.postService.updatePhotosOrder(req.user.userId, dto);
  }

  @Delete('photo/:photoId')
  deletePhoto(@Req() req: UserRequest, @Param('photoId') photoId: number) {
    return this.postService.deletePhoto(req.user.userId, photoId);
  }

  @Delete(':postId')
  deletePost(@Req() req: UserRequest, @Param('postId') postId: number) {
    return this.postService.deletePost(req.user.userId, postId);
  }

  @Get(':postId')
  getPostById(@Param('postId') postId: number) {
    return this.postService.getPostById(postId);
  }
}