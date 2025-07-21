import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './reply.entity';
import { Repository } from 'typeorm';
import { Store } from 'src/store/store.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { StoreService } from 'src/store/store.service';
import { InquiryService } from 'src/inquiry/inquiry.service';
import { reqReplyDto } from '../lib/dto/replyDto';
import { DataSource } from 'typeorm';
import { AlarmService } from 'src/alarm/alarm.service';

@Injectable()
export class ReplyService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly inquiryService: InquiryService,
    private readonly alarmService: AlarmService,
  ) {}

  async getReply(replyId: string, userId: string) {
    let userData: User | null = null;
    let storeUser: Store | null = null;

    if (userId !== undefined) {
      userData = await this.userService.userFindId(userId);
      if (userData && userData.storeId) {
        storeUser = await this.storeService.storeFindId(userData.storeId);
      }
    }

    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: { user: true, inquiry: { user: true } },
    });

    if (!reply) {
      throw new NotFoundException();
    }

    const inquiry = await this.inquiryService.inquiryFindId(reply.inquiryId);

    if (!inquiry) {
      throw new NotFoundException();
    }

    if (
      inquiry.isSecret &&
      userId !== undefined &&
      !(
        reply.userId === userId ||
        inquiry.userId === userId ||
        storeUser?.userId === userId
      )
    ) {
      throw new ForbiddenException();
    }
    return reply;
  }

  async updateRepliesData(userId: string, replyId: string, body: reqReplyDto) {
    const userData = await this.userService.userFindId(userId);

    if (!userData) {
      throw new NotFoundException();
    }
    if (userData.type === 'BUYER') {
      throw new ForbiddenException();
    }

    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
    });

    if (!reply) {
      throw new NotFoundException();
    }

    if (reply.userId !== userData.id) {
      throw new ForbiddenException();
    }

    await this.replyRepository.update({ id: replyId }, body);

    return this.replyRepository.findOne({
      where: { id: replyId },
      relations: {
        user: true,
      },
    });
  }

  async postQuiry(inquiryId: string, body: reqReplyDto, userId: string) {
    const userData = await this.userService.userFindId(userId);
    if (!userData) throw new NotFoundException();
    if (userData.type === 'BUYER') throw new ForbiddenException();

    const inquiry = await this.inquiryService.inquiryFindId(inquiryId);
    if (!inquiry) throw new NotFoundException();

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const savedReply = await queryRunner.manager.getRepository(Reply).save({
        userId,
        inquiryId,
        content: body.content,
      });

      await this.alarmService.createAlarmData(
        inquiry.userId,
        queryRunner.manager,
      );

      await this.inquiryService.inquiryStatus(inquiryId, queryRunner.manager);

      const replyWithUser = await queryRunner.manager
        .getRepository(Reply)
        .findOne({
          where: { id: savedReply.id },
          relations: ['user'],
        });

      await queryRunner.commitTransaction();
      return replyWithUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
