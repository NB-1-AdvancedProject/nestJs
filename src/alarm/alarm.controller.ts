import {
  Controller,
  Get,
  Patch,
  Param,
  Sse,
  MessageEvent, // 브라우저에서 메시지 기반 이벤트가 발생할 때 사용하는 표준 이벤트 타입
} from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { Observable, interval } from 'rxjs'; // 기본 내장
// Observable: 스트림 데이터 객체, 계속 데이터를 발행할 수 있음.
// interval: 조건에 맞게 emit하는 타이머
import { map, startWith, switchMap } from 'rxjs/operators';
import { UserId } from 'src/lib/decorators/userId.decorator';
import { AlarmResponseDto } from 'src/lib/dto/alarmDto';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Alarm') // 스웨거에서 그룹 이름으로 사용됨
@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Sse('sse') // nestjs에서 제공하는 스트리밍 데코레이터
  @ApiOperation({
    summary: 'SSE 알림 구독',
    description: '실시간 알림을 SSE로 구독합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '실시간 알람 스트림',
    content: {
      'text/event-stream': {
        example: [
          {
            id: 'alarm_123',
            userId: 'user_456',
            content: '상품이 품절되었습니다.',
            isChecked: false,
            createdAt: '2025-06-03T12:00:00.000Z',
            updatedAt: '2025-06-03T12:00:00.000Z',
          },
        ],
      },
    },
  })
  sse(@UserId() userId: string): Observable<MessageEvent> {
    // 30초마다 실행되는 Observable 스트림을 만들어 sse로 보내는 로직
    return interval(30000).pipe(
      // 여러 연산자를 연결해서 Observable을 가공하는 함수 (데이터가 흐르는 파이프라인)
      startWith(0), //시작하자마자 한번 emit
      switchMap(() => this.alarmService.getUserAlarms(userId)), //매번 emit 될 때마다 알림 목록 가져옴
      map((alarms) => ({
        data: alarms.map((a) => new AlarmResponseDto(a)), // SSE에 클라이언트로 전송하는 메시지는 {data: ...} 형식이어야 함
      })), //map 배열 아님. observalbe 스트림에서 emit되는 값을 실시간 가공하는 용도
    );
  }

  @Patch(':alarmId/check')
  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiParam({
    name: 'alarmId',
    type: String,
    required: true,
    description: '읽음 처리할 알림의 ID',
  })
  @ApiOkResponse({ description: '읽음 처리 완료' })
  @ApiResponse({
    status: 403,
    description: '사용자를 찾지 못했습니다.',
    schema: {
      example: {
        statusCode: 403,
        message: '접근 권한이 없습니다.',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '해당 알람이 없습니다.',
    schema: {
      example: {
        statusCode: 404,
        message: '요청한 리소스를 찾을 수 없습니다.',
        error: 'Not Found',
      },
    },
  })
  async checkAlarm(
    @Param('alarmId') alarmId: string,
    @UserId() userId: string,
  ) {
    await this.alarmService.checkAlarm(userId, alarmId);
    return;
  }

  @Get()
  @ApiOperation({ summary: '알림 목록 조회' })
  @ApiOkResponse({
    description: '알림 목록 반환',
    type: AlarmResponseDto,
    isArray: true,
  })
  async getListAlarm(@UserId() userId: string): Promise<AlarmResponseDto[]> {
    const alarms = await this.alarmService.getAllUserAlarms(userId);
    return alarms.map((a) => new AlarmResponseDto(a));
  }
}
