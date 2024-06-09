import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/repository/user.repository';

import { RegisterService } from './register.service';
import { RegisterDto } from '../dto/register.dto';

describe('RegisterService', () => {
  let service: RegisterService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and return success message', async () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const saveMock = jest.fn().mockResolvedValue({});
    const userMock = { save: saveMock };

    (userRepository.create as jest.Mock).mockReturnValue(userMock);

    const result = await service.register(registerDto);

    expect(userRepository.create).toHaveBeenCalledWith(registerDto);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'User created successfully',
      data: null,
    });
  });
});
