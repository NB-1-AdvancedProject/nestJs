import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './reply.entity';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';
import { InquiryModule } from 'src/inquiry/inquiry.module';
import { AlarmModule } from 'src/alarm/alarm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply]),
    UserModule,
    StoreModule,
    InquiryModule,
    AlarmModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
