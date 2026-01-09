import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookEntity } from './entities/book.entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity]), CommonModule],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
