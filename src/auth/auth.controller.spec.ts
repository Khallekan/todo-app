import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthController } from './auth.controller';
import { RegisterDto } from './dto/register.dto';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  const mockRegisterService = {
    register: jest.fn(),
  };

  let register: RegisterService;
  // let login: LoginService;

  const mockLoginService = {
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterService,
          useValue: mockRegisterService,
        },
        { provide: LoginService, useValue: mockLoginService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = app.get<AuthController>(AuthController);
    // login = app.get<LoginService>(LoginService);
    register = app.get<RegisterService>(RegisterService);

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user', async () => {
      const registerDto = {
        email: 'test@email.com',
        password: 'password@123',
      } satisfies RegisterDto;

      jest.spyOn(register, 'register').mockReturnValue(
        Promise.resolve({
          message: 'User created successfully',
          data: null,
        }),
      );

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        message: 'User created successfully',
        data: null,
      });

      expect(register.register).toHaveBeenCalled();
    });
  });

  // describe('login', () => {
  //   it('should login a user', async () => {
  //     const loginDto = {
  //       email: 'test@email.com',
  //       password: 'password@123',
  //     } satisfies LoginDto;

  //     jest.spyOn(login, 'login').mockReturnValue(Promise.resolve({

  //     }))
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
