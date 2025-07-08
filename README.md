## 초기 세팅 중 도메인+스키마 생성

### 1. 도메인 별로 폴더 생성

```
nest g resource 도메인명

// 이후 선택할 것
1. 형태 : REST API
2. CRUD entry point: n (자동으로 CRUD dto, 서비스까지 만들기를 원하진 X)
```

- 하는 일
  - 도메인명으로 폴더를 만들고
  - 그 안에 module, controller, service, (+ 관련 test 파일) 생성 및 연결

### 2. Entity 파일 생성

- 각 도메인 별로 entity 파일 생성 (`user.entity.ts`)
- typeORM 의 문법에 맞도록 class 생성
  - https://github.com/typeorm/typeorm/blob/master/docs/docs/entity/1-entities.md

### 3. TypeORM Config + app.module 에 연결

- configs/typeorm.config.ts
  - 역할: DB url 연결, 연결시 옵션 설정

- app.module.ts 에서

  ```
  @Module({
  imports: [
    ** TypeOrmModule.forRoot(typeORMConfig), **
    UserModule,] })
  ```

  - 역할: 이 config 를 기반으로 TypeORM 으로 DB 랑 연결해달라~

## 기본 Case 규칙\

### 폴더, 파일명 : kebab-case

- 이유: 시스템에서 헷갈리지 않도록

### 클래스명 : PascalCase

### 변수명 : camelCase
