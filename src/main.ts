import { NestFactory } from '@nestjs/core'; //NestJS 애플리케이션 인스턴스를 생성하는 팩토리 함수
import { AppModule } from './app.module'; // 앱의 루트 모듈 (전체 앱의 시작점)
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // AppModule을 기반으로 NestJS 애플리리케이션 인스턴스를 생성
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  /*목적: DTO 클래스에 붙은 @Expose() 같은 데코레이터를 자동으로 적용해서, 클라이언트에게
  필요한 값만 json으로 응답하게 만드는 전역 인터셉터를 등록하는 것

  new ClassSerializerInterceptor는 클래스 인스턴스를 JSON으로 바꾸는 과정에서 @Espose 같은
  데코레이터를 반영해서 필터링된 JSON을 만들어주는 역할 (걸러지는것 Exclude)

  @Roles, @public @exclude 등 데코레이터로 붙은 메타데이터를 코드에서 읽음
   */

  //swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('NestJS Swagger API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
