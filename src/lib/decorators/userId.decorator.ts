import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//createParamDecorator : NestJS에서 사용자 정의 파라미터 데코레이터를 만들 수 있게 해주는 함수
//즉 @UserId() 같은 데코레이터를 직접 정의할 수 있게 해줌

//ExecutionContext: 현재 실행 중인 문맥에 대한 정보 (HTTP 요청인지, GraphQL 요청인지 등을 추론 가능)
export const UserId = createParamDecorator(
  //userId라는 커스텀 데코레이터를 만듦
  //함수 내부는 요청 컨텍스트에서 원하는 값을 꺼내는 로직
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest(); //현재 요청이 http일 경우 express의 req 객체를 꺼냄

    if (process.env.NODE_ENV === 'test') {
      if (!request.user) {
        request.user = { id: '19fa4c6e-1e1a-4f37-ae64-d2b4dc52434f' };
      }
      return request.user.id;
    }

    if (!request.user || !request.user.id) {
      throw new Error('User not authenticated');
    }

    return request.user.id;
  },
);
