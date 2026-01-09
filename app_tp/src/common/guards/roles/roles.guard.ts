import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { User } from '../../../users/entities/user.entity/user.entity';
import { UserRoleEnum } from '../../enums/user-role.enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles =
      this.reflector.getAllAndOverride<UserRoleEnum[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request?.session?.userId;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.usersRepository
      .findOne({ where: { id: userId } })
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException('Not authenticated');
        }

        const hasRole = allowedRoles.some((role) =>
          RolesGuard.isAtLeast(user.role, role),
        );

        if (!hasRole) {
          return false;
        }

        return true;
      });
  }

  private static isAtLeast(userRole: UserRoleEnum, required: UserRoleEnum) {
    const rank: Record<UserRoleEnum, number> = {
      [UserRoleEnum.STUDENT]: 1,
      [UserRoleEnum.LIBRARIAN]: 2,
      [UserRoleEnum.ADMIN]: 3,
    };
    return rank[userRole] >= rank[required];
  }
}
