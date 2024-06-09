import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/repository/user.repository';

import { LoginService } from './login.service';
import { AuthService } from '../auth.service';

describe('LoginService', () => {
  let service: LoginService;

  let userRepository: UserRepository;

  let authService: AuthService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const mockAuthService = {
    comparePasswordHashes: jest.fn(),
    signTokens: jest.fn(),
  };

  const testEmail = 'test@example.com';
  const mockLoginDto = {
    email: testEmail,
    password: 'hashedPassword',
  };

  const mockUser = {
    id: '1',
    email: testEmail,
    password: 'hashedPassword',
    created_at: new Date(),
    updated_at: new Date(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    userRepository = module.get<UserRepository>(UserRepository);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user is not found', async () => {
    jest
      .spyOn(userRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    await expect(service.login(mockLoginDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if password is invalid', async () => {
    (jest.spyOn(userRepository, 'findByEmail') as jest.Mock).mockResolvedValue(
      mockUser,
    );

    jest.spyOn(authService, 'comparePasswordHashes').mockResolvedValue(false);

    await expect(
      service.login({ email: testEmail, password: 'wrongPassword' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return tokens if credentials are valid', async () => {
    const tokens = {
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
    };

    (jest.spyOn(userRepository, 'findByEmail') as jest.Mock).mockResolvedValue(
      mockUser,
    );

    jest.spyOn(authService, 'comparePasswordHashes').mockResolvedValue(true);

    jest.spyOn(authService, 'signTokens').mockResolvedValue(tokens);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toEqual({
      message: 'User logged in successfully',
      data: {
        ...tokens,
        id: mockUser.id,
        email: mockUser.email,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      },
    });
  });
});
