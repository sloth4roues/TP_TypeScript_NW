import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  imports: [AuthModule, UsersModule, BooksModule, BorrowingsModule, ReservationsModule, ReviewsModule, StatsModule, ExportModule, ActivityLogModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
