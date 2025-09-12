import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Interest } from './interest.entity';
import { InterestCategory } from './interest-category.entity';
import { InterestSubcategory } from './interest-subcategory.entity';
import { UserController } from './user.controller';
import { BannedUser } from './banned-user.entity';
import { UserMapper } from './user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, InterestCategory, InterestSubcategory, BannedUser])],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
  controllers: [UserController],
})
export class UserModule {}
