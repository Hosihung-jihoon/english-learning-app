import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './entities/user.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/auth/auth.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  providers: [UsersService, AuthGuard],
  exports: [UsersService, AuthGuard, MongooseModule],
})
export class UsersModule {}
