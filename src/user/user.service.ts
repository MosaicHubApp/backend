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
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    findById(userId: number) {
        return this.userRepository.findOne({ where: { user_id: userId } });
    }

    async verifyStudentEmail(userId: number) {
        const user = await this.findById(userId);
        if(!user) {
            throw new BadRequestException('User not found');
        }
        user.is_verified_student = await swot.isAcademic(user.email)
        return this.userRepository.save(user);
    }

    create(name: string, email: string, hashedPassword: string) {
        const user = this.userRepository.create({name, email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async updateEmail(userId: number, newEmail: string) {
        await this.userRepository.update({user_id: userId}, {email: newEmail, is_verified_student: false});
    }

    async updatePassword(userId: number, hashedPassword: string) {
        await this.userRepository.update({user_id: userId}, {password: hashedPassword});
    }

    async getAllInterests(): Promise<InterestsResponseDto> {
      const interests = await this.interestRepository.find();
      const interestCategories = await this.interestCategoryRepository.find();
      const interestSubcategories = await this.interestSubcategoryRepository.find();
      return {
        interests: interests.map(i => new IdNameDto(i.interest_id, i.name)),
        categories: interestCategories.map(i => new IdNameDto(i.interest_category_id, i.name)),
        subcategories: interestSubcategories.map(i => new IdNameDto(i.interest_subcategory_id, i.name))
      };
    }

    async updateUserInterests(userId: number, interestIds: number[]) {
      if (interestIds.length < MIN_INTERESTS_COUNT) {
        throw new BadRequestException(`Interest is less than ${MIN_INTERESTS_COUNT}`);
      }
      const user = await this.findById(userId);
      user!.interests = await this.interestRepository.findBy({
        interest_id: In(interestIds),
      });
      await this.userRepository.save(user!);
    }
}
