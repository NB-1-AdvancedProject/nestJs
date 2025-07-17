import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from './inquiry.entity';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  reqGetMyInquiryDto,
  InquiryChangeReqDto,
} from 'src/lib/dto/inquiryDto';
import { User } from 'src/user/user.entity';
import { Store } from 'src/store/store.entity';
import { NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    private readonly userService: UserService,
    private readonly StoreService: StoreService,
  ) {}

  async getList(query: reqGetMyInquiryDto, userId: string) {
    const { page, pageSize, status } = query;

    const where: FindOptionsWhere<Inquiry> = { userId, status };

    const [list, totalCount] = await this.inquiryRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
        product: {
          store: true,
        },
      },
    });
    return { list, totalCount };
  }

  async getDetail(inquiryId: string, userId: string) {
    let userData: User | null = null;
    let storeUser: Store | null = null;

    if (userId !== undefined) {
      userData = await this.userService.userFindId(userId);

      if (!userData) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      if (userData.storeId) {
        storeUser = await this.StoreService.storeFindId(userData.storeId);
      }
    }

    const inquiry = await this.inquiryRepository.findOne({
      where: {
        id: inquiryId,
      },
      relations: {
        user: true,
        reply: {
          user: true,
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException('문의가 존재하지 않습니다.');
    }

    if (
      inquiry.isSecret &&
      userId !== undefined &&
      !(inquiry.userId === userId || storeUser?.userId === userId)
    ) {
      throw new ForbiddenException('문의에 접근 권한이 없습니다.');
    }

    return inquiry;
  }

  async patchInquiry(
    inquiryId: string,
    userId: string,
    body: InquiryChangeReqDto,
  ) {
    const inquirys = await this.inquiryRepository.findOne({
      where: { id: inquiryId },
    });

    if (!inquirys) {
      throw new NotFoundException('문의가 존재하지 않습니다.');
    }

    if (inquirys.userId !== userId) {
      throw new ForbiddenException('문의 수정 권한이 없습니다.');
    }

    await this.inquiryRepository.update({ id: inquiryId, userId }, body);

    const updated = await this.inquiryRepository.findOne({
      where: { id: inquiryId },
    });

    return updated;
  }

  async deleteData(inquiryId: string, userId: string) {
    const inquiry = await this.inquiryRepository.findOne({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      throw new NotFoundException('문의가 존재하지 않습니다.');
    }

    if (inquiry.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.inquiryRepository.delete({ id: inquiryId });

    return inquiry;
  }
}
