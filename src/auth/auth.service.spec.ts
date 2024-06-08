import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { validationSchema } from 'src/configuration';
import { IMPORTS_KEY } from 'src/imports/types';
import { JwtPayloadType } from 'src/types/jwt-token.type';
import { User } from 'src/user/entities';
import { z } from 'zod';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let config: ConfigService;
  let argon: typeof mockArgonService;

  const mockUser = { id: 'testId' } as User;

  const testToken = 'testToken';
  const accessTestSecret = 'accessTestSecret';
  const refreshTestSecret = 'refreshTestSecret';
  const argonPasswordTestSecret = 'passwordSecret';

  const mockJwtService = {
    signAsync: jest.fn().mockReturnValue(testToken),
  };

  const mockConfigService = {
    get: jest.fn((key: keyof z.infer<typeof validationSchema>) => {
      switch (key) {
        case 'JWT_ACCESS_SECRET_KEY':
          return accessTestSecret;
        case 'JWT_REFRESH_SECRET_KEY':
          return refreshTestSecret;
        case 'ARGON_PASSWORD_SECRET':
          return argonPasswordTestSecret;
        default:
          return null;
      }
    }),
  };

  const mockArgonService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: IMPORTS_KEY.ARGON, useValue: mockArgonService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
    argon = module.get<typeof mockArgonService>(IMPORTS_KEY.ARGON);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signTokens', () => {
    it("should return an object with 'access_token' and 'refresh_token' keys", async () => {
      const mockJwtPayload: JwtPayloadType = {
        id: mockUser.id,
      };

      const mockAccessTokenConfig = {
        expiresIn: '1h',
        secret: accessTestSecret,
      };

      const mockRefreshTokenConfig = {
        expiresIn: '24h',
        secret: refreshTestSecret,
      };

      const result = await service.signTokens(mockUser);

      expect(jwt.signAsync).toHaveBeenCalledTimes(2);
      expect(jwt.signAsync).toHaveBeenCalledWith(
        mockJwtPayload,
        mockAccessTokenConfig,
      );
      expect(jwt.signAsync).toHaveBeenCalledWith(
        mockJwtPayload,
        mockRefreshTokenConfig,
      );
      expect(config.get).toHaveBeenCalledTimes(2);
      expect(config.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET_KEY');
      expect(config.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET_KEY');

      expect(result).toEqual({
        access_token: testToken,
        refresh_token: testToken,
      });
    });
  });

  describe('comparePasswordHashes', () => {
    it('should return true if password hashes match', async () => {
      jest.spyOn(argon, 'verify').mockReturnValueOnce(true);

      const result = await service.comparePasswordHashes(
        'hashedPassword',
        'hashedPassword',
      );

      expect(argon.verify).toHaveBeenCalledTimes(1);
      expect(argon.verify).toHaveBeenCalledWith(
        'hashedPassword',
        'hashedPassword',
        {
          secret: Buffer.from(argonPasswordTestSecret),
        },
      );
      expect(config.get).toHaveBeenCalled();
      expect(config.get).toHaveBeenCalledWith('ARGON_PASSWORD_SECRET');

      expect(result).toEqual(true);
    });

    it('should return false if password hashes do not match', async () => {
      jest.spyOn(argon, 'verify').mockReturnValueOnce(false);

      const result = await service.comparePasswordHashes(
        'hashedPassword',
        'wrongPassword',
      );

      expect(argon.verify).toHaveBeenCalled();
      expect(argon.verify).toHaveBeenCalledWith(
        'hashedPassword',
        'wrongPassword',
        {
          secret: Buffer.from(argonPasswordTestSecret),
        },
      );
      expect(config.get).toHaveBeenCalled();
      expect(config.get).toHaveBeenCalledWith('ARGON_PASSWORD_SECRET');

      expect(result).toEqual(false);
    });
  });
});
