import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TargetsController } from './targets.controller';
import { TargetsService } from './targets.service';
import { TargetEntity, TargetSchema } from './entities/target.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TargetEntity.name, schema: TargetSchema }]),
    UsersModule,
  ],
  controllers: [TargetsController],
  providers: [TargetsService],
  exports: [TargetsService, MongooseModule],
})
export class TargetsModule {}
