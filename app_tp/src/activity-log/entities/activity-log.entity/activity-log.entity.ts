import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { ActivityTypeEnum } from '../../../common/enums/activity-type.enum/activity-type.enum';

@Entity('activity_log')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.activityLogs, { nullable: false })
  user: User;

  @Column({ type: 'text', enum: ActivityTypeEnum })
  action: ActivityTypeEnum;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
