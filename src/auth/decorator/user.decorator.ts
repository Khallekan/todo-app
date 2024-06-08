import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/entities';

type DataType = keyof Omit<
  User,
  | 'password'
  | 'save'
  | 'softRemove'
  | 'hashPassword'
  | 'recover'
  | 'remove'
  | 'reload'
  | 'hasId'
>;

export const GetUser = createParamDecorator(
  (data: DataType | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    return data && user ? user[data] : user;
  },
);
