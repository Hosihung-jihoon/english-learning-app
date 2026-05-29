import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import type { AuthSession } from '@shared/types';
import { createToken } from '../../common/auth/token.util';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const digest = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${digest}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, digest] = storedHash.split(':');
  const provided = Buffer.from(scryptSync(password, salt, 64).toString('hex'));
  const expected = Buffer.from(digest);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.userModel.create({
      name: dto.name?.trim() || dto.email.split('@')[0],
      email: dto.email.toLowerCase(),
      passwordHash: hashPassword(dto.password),
      role: 'student',
    });

    return this.buildSession(user);
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildSession(user);
  }

  async me(userId: string) {
    return this.usersService.findPublicById(userId);
  }

  private buildSession(user: UserEntity & { _id: { toString(): string } }) {
    const publicUser = this.usersService.toPublicUser(user);
    const token = createToken(
      {
        sub: publicUser.id,
        email: publicUser.email,
        role: publicUser.role,
      },
      this.configService.getOrThrow<string>('JWT_SECRET'),
    );

    return {
      token,
      user: publicUser,
    } satisfies AuthSession;
  }
}
