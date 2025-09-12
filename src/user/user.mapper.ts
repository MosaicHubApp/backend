import { User } from './user.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { IdNameDto } from '../common/dto/id-name.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  userToDto(user: User): UserProfileDto {
    return {
      id: user.user_id,
      name: user.name,
      interests: user.interests ? user.interests.map(
        (i) => new IdNameDto(i.interest_id, i.name),
      ) : undefined,
      description: user.description,
      photoUrl: user.photo_url || undefined,
      isVerifiedStudent: user.is_verified_student,
      telegramUsername: user.telegram_username,
      instagramUsername: user.instagram_username,
      linkedinUsername: user.linkedin_username,
      githubUsername: user.github_username,
    };
  }
}