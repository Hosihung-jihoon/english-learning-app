import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { UserProfile } from '@shared/types';
import { UserEntity } from './entities/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findPrivateById(id: string) {
    return this.userModel.findById(id);
  }

  async findPublicById(id: string): Promise<UserProfile | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toPublicUser(user) : null;
  }

  toPublicUser(user: UserEntity & { _id: { toString(): string }; createdAt?: Date }) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      avatarUrl: user.avatarUrl,
      planLabel: user.planLabel,
      scoreLabel: user.scoreLabel,
    } satisfies UserProfile;
  }
}
