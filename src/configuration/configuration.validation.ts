import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { z } from 'zod';

import { config } from './configuration';

const possibleEnviroments = ['development', 'production', 'test'] as const;

export enum EnviromentsEnum {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const Enviroment = z.enum(['development', 'production', 'test']);

export class EnviromentVariables {
  @IsEnum(EnviromentsEnum)
  @IsNotEmpty()
  NODE_ENV: z.infer<typeof Enviroment>;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_VERSION: number;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;

  @IsString()
  @IsNotEmpty()
  PGADMIN_DEFAULT_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  PGADMIN_DEFAULT_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  ARGON_PASSWORD_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export const validationSchema = z.object({
  NODE_ENV: z.enum(possibleEnviroments).default('development'),
  PORT: z.coerce.number().default(config().port),
  POSTGRES_VERSION: z.coerce.number(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  PGADMIN_DEFAULT_EMAIL: z.string(),
  PGADMIN_DEFAULT_PASSWORD: z.string(),
  JWT_ACCESS_SECRET_KEY: z.string(),
  JWT_REFRESH_SECRET_KEY: z.string(),
  ARGON_PASSWORD_SECRET: z.string(),
});

validationSchema.parse(process.env);
