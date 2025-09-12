import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Interest } from './entities/interest.entity';
import { InterestCategory } from './entities/interest-category.entity';
import { InterestSubcategory } from './entities/interest-subcategory.entity';
import { UserController } from './user.controller';
import { BannedUser } from './entities/banned-user.entity';
import { UserMapper } from './user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, InterestCategory, InterestSubcategory, BannedUser])],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
  controllers: [UserController],
})
export class UserModule {}
