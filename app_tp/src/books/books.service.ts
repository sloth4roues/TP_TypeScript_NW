import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { BookEntity } from './entities/book.entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';
import { PaginationDto } from '../common/dto/pagination.dto/pagination.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async getById(id: number) {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async list(query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const order = this.buildOrder(query.sortBy, query.order);

    const [items, total] = await this.booksRepository.findAndCount({
      order,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateBookDto) {
    const existing = await this.booksRepository.findOne({
      where: { isbn: dto.isbn },
    });
    if (existing) {
      throw new ConflictException('ISBN already exists');
    }

    const publicationYear = dto.publicationYear ?? dto.publishedYear;
    if (publicationYear === undefined || publicationYear === null) {
      throw new BadRequestException('publicationYear is required');
    }

    const book = this.booksRepository.create({
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      publisher: dto.publisher,
      publicationYear,
      totalCopies: dto.totalCopies,
      availableCopies: dto.totalCopies,
    });

    return this.booksRepository.save(book);
  }

  private buildOrder(sortBy?: string, order?: 'ASC' | 'DESC'): FindOptionsOrder<BookEntity> {
    const allowed: Array<keyof BookEntity> = [
      'title',
      'author',
      'publicationYear',
      'availableCopies',
      'createdAt',
    ];
    const key = allowed.includes(sortBy as keyof BookEntity)
      ? (sortBy as keyof BookEntity)
      : 'title';
    return { [key]: order ?? 'ASC' } as FindOptionsOrder<BookEntity>;
  }
}
