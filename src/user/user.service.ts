import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as swot from "swot-node";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
}
