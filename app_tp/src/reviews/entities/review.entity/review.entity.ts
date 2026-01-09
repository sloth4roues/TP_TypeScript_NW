import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { BookEntity } from '../../../books/entities/book.entity/book.entity';

@Entity('review')
@Unique(['user', 'book'])
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.reviews, { nullable: false })
  user: User;

  @ManyToOne(() => BookEntity, (book: BookEntity) => book.reviews, {
    nullable: false,
  })
  book: BookEntity;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
