import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
