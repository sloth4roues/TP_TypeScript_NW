import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { BookEntity } from '../../../books/entities/book.entity/book.entity';
import { BorrowingStatusEnum } from '../../../common/enums/borrowing-status.enum/borrowing-status.enum';

@Entity('borrowing')
export class BorrowingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.borrowings, { nullable: false })
  user: User;

  @ManyToOne(
    () => BookEntity,
    (book: BookEntity) => book.borrowings,
    { nullable: false },
  )
  book: BookEntity;

  @CreateDateColumn()
  borrowedAt: Date;

  @Column({ type: 'datetime' })
  dueAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedAt: Date | null;

  @Column({
    type: 'text',
    enum: BorrowingStatusEnum,
    default: BorrowingStatusEnum.ACTIVE,
  })
  status: BorrowingStatusEnum;

  @UpdateDateColumn()
  updatedAt: Date;
}
