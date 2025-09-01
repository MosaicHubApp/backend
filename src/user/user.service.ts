import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import * as swot from 'swot-node';
import { InterestsResponseDto } from './dto/interests-response.dto';
import { Interest } from './interest.entity';
import { InterestCategory } from './interest-category.entity';
import { InterestSubcategory } from './interest-subcategory.entity';
import { IdNameDto } from './dto/id-name.dto';
import { MIN_INTERESTS_COUNT } from './user.constants';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { BannedUser } from './banned-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
    @InjectRepository(InterestCategory)
    private interestCategoryRepository: Repository<InterestCategory>,
    @InjectRepository(InterestSubcategory)
    private interestSubcategoryRepository: Repository<InterestSubcategory>,
    @InjectRepository(BannedUser)
    private bannedUserRepository: Repository<BannedUser>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(userId: number) {
    return this.userRepository.findOne({ where: { user_id: userId } });
  }

  async verifyStudentEmail(userId: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.is_verified_student = await swot.isAcademic(user.email);
    return this.userRepository.save(user);
  }

  create(name: string, email: string, hashedPassword: string) {
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateEmail(userId: number, newEmail: string) {
    await this.userRepository.update(
      { user_id: userId },
      { email: newEmail, is_verified_student: false },
    );
  }

  async updatePassword(userId: number, hashedPassword: string) {
    await this.userRepository.update(
      { user_id: userId },
      { password: hashedPassword },
    );
  }

  async getAllInterests(): Promise<InterestsResponseDto> {
    const interests = await this.interestRepository.find();
    const interestCategories = await this.interestCategoryRepository.find();
    const interestSubcategories =
      await this.interestSubcategoryRepository.find();
    return {
      interests: interests.map((i) => new IdNameDto(i.interest_id, i.name)),
      categories: interestCategories.map(
        (i) => new IdNameDto(i.interest_category_id, i.name),
      ),
      subcategories: interestSubcategories.map(
        (i) => new IdNameDto(i.interest_subcategory_id, i.name),
      ),
    };
  }

  async updateUserInterests(userId: number, interestIds: number[]) {
    if (interestIds.length < MIN_INTERESTS_COUNT) {
      throw new BadRequestException(
        `Interest is less than ${MIN_INTERESTS_COUNT}`,
      );
    }
    const user = await this.findById(userId);
    user!.interests = await this.interestRepository.findBy({
      interest_id: In(interestIds),
    });
    await this.userRepository.save(user!);
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['interests'],
    });
    if (!user) {
      throw new BadRequestException();
    }
    return this.mapUserToProfileDto(user);
  }

  private mapUserToProfileDto(user: User): UserProfileDto {
    return {
      id: user.user_id,
      name: user.name,
      interests: user.interests ? user.interests.map(
        (i) => new IdNameDto(i.interest_id, i.name),
      ) : undefined,
      description: user.description,
      photoUrl: user.photo_url,
      isVerifiedStudent: user.is_verified_student,
      telegramUsername: user.telegram_username,
      instagramUsername: user.instagram_username,
      linkedinUsername: user.linkedin_username,
      githubUsername: user.github_username,
    };
  }

  async updateProfile(userId: number, dto: UserUpdateDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException();
    }
    user.name = dto.name;
    user.description = dto.description;
    user.telegram_username = dto.telegramUsername;
    user.instagram_username = dto.instagramUsername;
    user.linkedin_username = dto.linkedinUsername;
    user.github_username = dto.githubUsername;
    await this.userRepository.save(user);
  }

  async updateUserAvatar(userId: number, filename: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.photo_url = `/uploads/avatars/${filename}`;
    await this.userRepository.save(user);

    return { message: 'Avatar updated successfully', photoUrl: user.photo_url };
  }

  async banUser(userId: number, userIdToBan: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const userToBan = await this.findById(userIdToBan);
    if (!userToBan) {
      throw new BadRequestException('User to ban not found');
    }
    if (userId == userIdToBan) {
      throw new BadRequestException('You cannot ban yourself');
    }
    const bannedUser = await this.bannedUserRepository.findOne({
      where: { banned_by_user: user, banned_user: userToBan },
    });
    if (bannedUser) {
      throw new BadRequestException('User is already banned');
    }
    await this.bannedUserRepository.save({
      banned_by_user: user,
      banned_user: userToBan,
    });
  }

  async unbanUser(userId: number, userIdToUnban: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const userToBan = await this.findById(userIdToUnban);
    if (!userToBan) {
      throw new BadRequestException('User to ban not found');
    }
    const bannedUser = await this.bannedUserRepository.findOne({
      where: { banned_by_user: user, banned_user: userToBan },
    });
    if (!bannedUser) {
      throw new BadRequestException('User is not banned');
    }
    await this.bannedUserRepository.remove(bannedUser);
  }

  async getBannedUsers(userId: number) {
    const bannedUsers = await this.bannedUserRepository.find({
      where: { banned_by_user: { user_id: userId } },
      relations: ['banned_user'],
    });
    return bannedUsers
      .map((bannedUser) => bannedUser.banned_user)
      .map(this.mapUserToProfileDto);
  }
}
