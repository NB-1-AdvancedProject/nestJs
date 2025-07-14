import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './inquiry.entity';
import { User } from 'src/user/user.entity';
import { Store } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, User, Store])],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
