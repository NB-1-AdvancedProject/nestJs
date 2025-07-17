import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/authDTO';
import { User, UserType } from 'src/user/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.createUser and return created user', async () => {
    // Arrange
    const dto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: '1234',
      type: UserType.BUYER,
    };

    const expectedUser: User = {
      name: dto.name,
      email: dto.email,
      password: 'hashed-password',
      type: dto.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockAuthService.createUser.mockResolvedValue(expectedUser);

    // Act
    const result = await controller.signup(dto);

    // Assert
    expect(mockAuthService.createUser).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedUser);
  });
});
