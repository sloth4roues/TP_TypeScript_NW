import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { SessionAuthGuard } from '../common/guards/session-auth/session-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { UserRoleEnum } from '../common/enums/user-role.enum/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto/pagination.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    return this.booksService.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getById(id);
  }

  @Post()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.LIBRARIAN)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }
}
