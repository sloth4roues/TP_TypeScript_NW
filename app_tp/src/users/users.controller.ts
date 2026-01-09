import { Body, Controller, Delete, Get, Param, Patch, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto/update-user-role.dto';
import { UpdateWhitelistDto } from './dto/update-whitelist.dto/update-whitelist.dto';
import { PaginationDto } from '../common/dto/pagination.dto/pagination.dto';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { SessionAuthGuard } from '../common/guards/session-auth/session-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { UserRoleEnum } from '../common/enums/user-role.enum/user-role.enum';

@Controller('users')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers(@Query() query: PaginationDto, @Req() req: Request) {
    return this.usersService.listUsers(query, req.session.userId ?? null);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.usersService.getUserById(id, req.session.userId ?? null);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.usersService.deleteUser(id, req.session.userId ?? null);
  }

  @Patch(':id')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.updateProfile(
      id,
      dto.firstName,
      dto.lastName,
      req.session.userId ?? null,
    );
  }

  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: Request,
  ) {
    return this.usersService.updateRole(id, dto.role, req.session.userId ?? null);
  }

  @Patch(':id/whitelist')
  updateWhitelist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWhitelistDto,
    @Req() req: Request,
  ) {
    return this.usersService.updateWhitelist(id, dto.whitelisted, req.session.userId ?? null);
  }
}
