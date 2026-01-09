import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity/user.entity';
import { UserRoleEnum } from '../common/enums/user-role.enum/user-role.enum';
import { LoginDto } from './dto/login.dto/login.dto';
import { RegisterDto } from './dto/register.dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const normalizedEmail = dto.email.trim().toLowerCase();
    const bootstrapAdminEmail =
      this.configService.get<string>('BOOTSTRAP_ADMIN_EMAIL')?.trim().toLowerCase() ??
      'admin@example.com';
    const isBootstrapAdmin = normalizedEmail === bootstrapAdminEmail;

    const user = this.usersRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: isBootstrapAdmin ? UserRoleEnum.ADMIN : UserRoleEnum.STUDENT,
      whitelisted: isBootstrapAdmin,
    });

    const saved = await this.usersRepository.save(user);
    return this.sanitizeUser(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.whitelisted) {
      throw new ForbiddenException('User not whitelisted');
    }

    return this.sanitizeUser(user);
  }

  async me(userId: number | null) {
    if (!userId) {
      return null;
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
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
}
