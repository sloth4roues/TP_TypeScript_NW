import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './users/entities/user.entity/user.entity';
import { BookEntity } from './books/entities/book.entity/book.entity';
import { BorrowingEntity } from './borrowings/entities/borrowing.entity/borrowing.entity';
import { ReservationEntity } from './reservations/entities/reservation.entity/reservation.entity';
import { ReviewEntity } from './reviews/entities/review.entity/review.entity';
import { ActivityLogEntity } from './activity-log/entities/activity-log.entity/activity-log.entity';

// Session entity (connect-typeorm)
import { SessionEntity } from './common/session/session.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BorrowingsModule } from './borrowings/borrowings.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StatsModule } from './stats/stats.module';
import { ExportModule } from './export/export.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPath = config.get<string>('DB_PATH') ?? './db.sqlite';

        return {
          type: 'sqlite' as const,
          database: dbPath,
          entities: [
            User,
            BookEntity,
            BorrowingEntity,
            ReservationEntity,
            ReviewEntity,
            ActivityLogEntity,
            SessionEntity,
          ],
          synchronize: true,
          logging: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),

    CommonModule,
    AuthModule,
    UsersModule,
    BooksModule,
    BorrowingsModule,
    ReservationsModule,
    ReviewsModule,
    StatsModule,
    ExportModule,
    ActivityLogModule,
  ],
})
export class AppModule {}
