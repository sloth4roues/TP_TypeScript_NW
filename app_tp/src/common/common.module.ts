import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity/user.entity';
import { RolesGuard } from './guards/roles/roles.guard';
import { SessionAuthGuard } from './guards/session-auth/session-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RolesGuard, SessionAuthGuard],
  exports: [TypeOrmModule, RolesGuard, SessionAuthGuard],
})
export class CommonModule {}
