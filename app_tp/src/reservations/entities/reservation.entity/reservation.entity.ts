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
import { ReservationStatusEnum } from '../../../common/enums/reservation-status.enum/reservation-status.enum';

@Entity('reservation')
@Unique(['user', 'book'])
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.reservations, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => BookEntity, (book: BookEntity) => book.reservations, {
    nullable: false,
  })
  book: BookEntity;

  @CreateDateColumn()
  requestedAt: Date;

  @Column({
    type: 'text',
    enum: ReservationStatusEnum,
    default: ReservationStatusEnum.PENDING,
  })
  status: ReservationStatusEnum;

  @UpdateDateColumn()
  updatedAt: Date;
}
