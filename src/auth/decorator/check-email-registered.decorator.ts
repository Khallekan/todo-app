import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from 'src/user/repository/user.repository';

@ValidatorConstraint({ async: true, name: 'isEmailNotRegistered' })
export class IsEmailNotRegistered implements ValidatorConstraintInterface {
  constructor(protected userRepository: UserRepository) {}

  async validate(email: string) {
    return !(await this.userRepository.findByEmail(email));
  }

  defaultMessage(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    throw new BadRequestException(
      `User with email - ${validationArguments?.value} - already exists`,
    );
  }
}

@ValidatorConstraint({ async: true, name: 'isEmailRegistered' })
export class IsEmailRegistered implements ValidatorConstraintInterface {
  constructor(protected userRepository: UserRepository) {}

  async validate(email: string) {
    const user = await this.userRepository.findByEmail(email);

    return Boolean(user);
  }

  defaultMessage(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    throw new BadRequestException(
      `User with email - ${validationArguments?.value} - does not exist`,
    );
  }
}

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}

export function EmailRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailRegistered,
    });
  };
}
