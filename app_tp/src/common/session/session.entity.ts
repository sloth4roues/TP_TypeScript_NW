import { Entity, Index, Column, PrimaryColumn, DeleteDateColumn } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @Index()
  @Column('bigint')
  expiredAt: number;

  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  destroyedAt: Date | null;
}
