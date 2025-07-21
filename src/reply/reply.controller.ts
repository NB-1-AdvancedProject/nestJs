import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { Get, Param } from '@nestjs/common';
import { UserId } from 'src/lib/decorators/userId.decorator';
import { plainToInstance } from 'class-transformer';
import { InquiryDetailDto } from '../lib/dto/inquiryDto';
import { ValidationPipe } from '@nestjs/common';
import { reqReplyDto, replyResponseDto } from '../lib/dto/replyDto';
import {
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Reply')
@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':replyId/replies')
  @ApiOperation({ summary: '답변 상세 조회' })
  @ApiParam({ name: 'replyId', type: String, description: '답변 ID' })
  @ApiResponse({
    status: 200,
    description: '답변 상세 조회 성공',
    type: InquiryDetailDto,
  })
  async getDetailReply(
    @UserId() userId: string,
    @Param('replyId') replyId: string,
  ): Promise<InquiryDetailDto> {
    const reply = await this.replyService.getReply(replyId, userId);

    return plainToInstance(InquiryDetailDto, reply, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':replyId/replies')
  @ApiOperation({ summary: '답변 수정' })
  @ApiParam({ name: 'replyId', type: String, description: '답변 ID' })
  @ApiBody({ type: reqReplyDto })
  @ApiResponse({
    status: 200,
    description: '답변 수정 성공',
    type: replyResponseDto,
  })
  async patchReplies(
    @UserId() userId: string,
    @Param('replyId') replyId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: reqReplyDto,
  ): Promise<replyResponseDto> {
    const reply = await this.replyService.updateRepliesData(
      userId,
      replyId,
      body,
    );

    return plainToInstance(replyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':inquiryId/replies')
  @ApiOperation({ summary: '답변 등록' })
  @ApiParam({ name: 'inquiryId', type: String, description: '문의 ID' })
  @ApiBody({ type: reqReplyDto })
  @ApiResponse({
    status: 201,
    description: '답변 등록 성공',
    type: replyResponseDto,
  })
  async postQuiryData(
    @UserId() userId: string,
    @Param('inquiryId') inquiryId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: reqReplyDto,
  ): Promise<replyResponseDto> {
    const reply = await this.replyService.postQuiry(inquiryId, body, userId);

    return plainToInstance(replyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
