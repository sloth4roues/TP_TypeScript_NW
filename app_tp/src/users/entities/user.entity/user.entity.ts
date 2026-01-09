import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BorrowingEntity } from '../../../borrowings/entities/borrowing.entity/borrowing.entity';
import { ReservationEntity } from '../../../reservations/entities/reservation.entity/reservation.entity';
import { ReviewEntity } from '../../../reviews/entities/review.entity/review.entity';
import { ActivityLogEntity } from '../../../activity-log/entities/activity-log.entity/activity-log.entity';
import { UserRoleEnum } from '../../../common/enums/user-role.enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', enum: UserRoleEnum, default: UserRoleEnum.STUDENT })
  role: UserRoleEnum;

  @Column({ default: false })
  whitelisted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BorrowingEntity, (borrowing) => borrowing.user)
  borrowings: BorrowingEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations: ReservationEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => ActivityLogEntity, (log) => log.user)
  activityLogs: ActivityLogEntity[];
}
