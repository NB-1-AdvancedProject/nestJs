import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CacheWithSetGetDel } from 'src/auth/dto/authDTO';
import { User, UserType } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let jwtService: Partial<JwtService>;
  let cacheManager: Partial<CacheWithSetGetDel>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    cacheManager = {
      set: jest.fn(),
      del: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  test('POST /auth/signup', async () => {
    const dto = {
      name: 'test',
      email: 'test@example.com',
      password: 'password1234',
      type: UserType.BUYER,
    };

    const hashed = 'hashed-password';

    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementation(() => Promise.resolve('test-salt'));
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashed-password'));

    const createdUser = { ...dto, password: hashed } as User;
    userRepository.create!.mockReturnValue(createdUser);
    userRepository.save!.mockResolvedValue(createdUser);

    const result = await authService.createUser(dto);

    expect(result).toEqual(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: dto.name,
      password: hashed,
      email: dto.email,
      type: dto.type,
    });

    expect(userRepository.save).toHaveBeenCalledWith(createdUser);
  });
});
