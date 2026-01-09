import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BorrowingEntity } from '../../../borrowings/entities/borrowing.entity/borrowing.entity';
import { ReservationEntity } from '../../../reservations/entities/reservation.entity/reservation.entity';
import { ReviewEntity } from '../../../reviews/entities/review.entity/review.entity';

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  isbn: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column({ type: 'int' })
  publicationYear: number;

  @Column({ type: 'int', default: 0 })
  totalCopies: number;

  @Column({ type: 'int', default: 0 })
  availableCopies: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BorrowingEntity, (borrowing) => borrowing.book)
  borrowings: BorrowingEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.book)
  reservations: ReservationEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.book)
  reviews: ReviewEntity[];
}
