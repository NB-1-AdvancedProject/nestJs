import {
  Controller,
  Query,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import {
  InquiryListResponseDto,
  InquiryResponseItemDto,
  reqGetMyInquiryDto,
  InquiryDetailDto,
  InquiryChangeReqDto,
  InquiryPatchResponseDto,
} from '../lib/dto/inquiryDto';
import { UserId } from 'src/lib/decorators/userId.decorator';
import { plainToInstance } from 'class-transformer';
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Inquiry')
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '내 문의 목록 조회' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['noAnswer', 'CompletedAnswer'],
  })
  @ApiOkResponse({ type: InquiryListResponseDto })
  async getInquiry(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: reqGetMyInquiryDto,
    @UserId() userId: string,
  ): Promise<InquiryListResponseDto> {
    const { list, totalCount } = await this.inquiryService.getList(
      query,
      userId,
    );

    return {
      list: plainToInstance(InquiryResponseItemDto, list, {
        excludeExtraneousValues: true,
      }),
      totalCount,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':inquiryId')
  @ApiOperation({ summary: '문의 상세 조회' })
  @ApiParam({ name: 'inquiryId', description: '문의 ID' })
  @ApiOkResponse({ type: InquiryDetailDto })
  @ApiNotFoundResponse({
    description: '문의가 존재하지 않는 경우',
    schema: {
      example: {
        statusCode: 404,
        message: '문의가 존재하지 않습니다.',
        error: 'Not Found',
      },
    },
  })
  async getDetailInquiry(
    @Param('inquiryId') inquiryId: string,
    @UserId() userId: string,
  ): Promise<InquiryDetailDto> {
    const inquiry = await this.inquiryService.getDetail(inquiryId, userId);

    return plainToInstance(InquiryDetailDto, inquiry, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':inquiryId')
  @ApiOperation({ summary: '문의 수정' })
  @ApiParam({ name: 'inquiryId', description: '문의 ID' })
  @ApiBody({ type: InquiryChangeReqDto })
  @ApiResponse({ status: 200, type: InquiryPatchResponseDto })
  async changeInquiry(
    @Param('inquiryId') inquiryId: string,
    @UserId() userId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: InquiryChangeReqDto,
  ): Promise<InquiryPatchResponseDto> {
    const inquiry = await this.inquiryService.patchInquiry(
      inquiryId,
      userId,
      body,
    );
    return plainToInstance(InquiryPatchResponseDto, inquiry, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':inquiryId')
  @ApiOperation({ summary: '문의 삭제' })
  @ApiParam({ name: 'inquiryId', description: '문의 ID' })
  @ApiResponse({ status: 200, type: InquiryPatchResponseDto })
  async deleteData(
    @Param('inquiryId') inquiryId: string,
    @UserId() userId: string,
  ): Promise<InquiryPatchResponseDto> {
    const inquiry = await this.inquiryService.deleteData(inquiryId, userId);

    return plainToInstance(InquiryPatchResponseDto, inquiry, {
      excludeExtraneousValues: true,
    });
  }
}
