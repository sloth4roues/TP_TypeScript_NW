import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { User } from './entities/user.entity/user.entity';
import { UserRoleEnum } from '../common/enums/user-role.enum/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateProfile(
    targetUserId: number,
    firstName: string | undefined,
    lastName: string | undefined,
    actorUserId: number | null,
  ) {
    await this.requireAdmin(actorUserId);

    const target = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (typeof firstName === 'string') {
      target.firstName = firstName;
    }

    if (typeof lastName === 'string') {
      target.lastName = lastName;
    }

    const saved = await this.usersRepository.save(target);
    return this.sanitizeUser(saved);
  }

  async listUsers(query: PaginationDto, actorUserId: number | null) {
    await this.requireAdmin(actorUserId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const order = this.buildOrder(query.sortBy, query.order);

    const users = await this.usersRepository.find({
      order,
      take: limit,
      skip: (page - 1) * limit,
    });

    return users.map((user) => this.sanitizeUser(user));
  }

  async getUserById(targetUserId: number, actorUserId: number | null) {
    await this.requireAdmin(actorUserId);

    const user = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async deleteUser(targetUserId: number, actorUserId: number | null) {
    await this.requireAdmin(actorUserId);

    const target = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete({ id: targetUserId });
    return { success: true };
  }

  async updateRole(
    targetUserId: number,
    role: UserRoleEnum,
    actorUserId: number | null,
  ) {
    await this.requireAdmin(actorUserId);

    const target = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }

    target.role = role;
    const saved = await this.usersRepository.save(target);
    return this.sanitizeUser(saved);
  }

  async updateWhitelist(
    targetUserId: number,
    whitelisted: boolean,
    actorUserId: number | null,
  ) {
    const actor = await this.requireAdmin(actorUserId);

    if (actor.id === targetUserId) {
      throw new ForbiddenException('Cannot modify own whitelist');
    }

    const target = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });
    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (target.role === UserRoleEnum.ADMIN && !whitelisted) {
      throw new ForbiddenException('Cannot remove admin from whitelist');
    }

    target.whitelisted = whitelisted;
    const saved = await this.usersRepository.save(target);

    return this.sanitizeUser(saved);
  }

  private async requireAdmin(actorUserId: number | null) {
    if (!actorUserId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const actor = await this.usersRepository.findOne({
      where: { id: actorUserId },
    });
    if (!actor) {
      throw new UnauthorizedException('Not authenticated');
    }

    if (actor.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException('Admin only');
    }

    return actor;
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      whitelisted: user.whitelisted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private buildOrder(sortBy?: string, order?: 'ASC' | 'DESC'): FindOptionsOrder<User> {
    const allowed: Array<keyof User> = [
      'createdAt',
      'email',
      'firstName',
      'lastName',
      'role',
    ];
    const key = allowed.includes(sortBy as keyof User) ? (sortBy as keyof User) : 'createdAt';
    return { [key]: order ?? 'DESC' } as FindOptionsOrder<User>;
  }
}
