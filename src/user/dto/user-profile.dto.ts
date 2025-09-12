import { IdNameDto } from '../../common/dto/id-name.dto';

export class UserProfileDto {
  id: number;
  name: string;
  interests?: IdNameDto[];
  description: string;
  photoUrl?: string;
  isVerifiedStudent: boolean;
  telegramUsername?: string;
  instagramUsername?: string;
  linkedinUsername?: string;
  githubUsername?: string;
}