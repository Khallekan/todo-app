import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SortOrder } from 'src/types/sort-order.type';

import { TaskStatus } from '../entities/task.entity';

export class GetTasksDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @IsOptional()
  @Min(1, { message: 'Minimum is 1' })
  @IsNumber()
  @Transform(({ value }: TransformFnParams) => Number(value))
  limit?: number = 10;

  @IsOptional()
  @Min(1)
  @IsNumber()
  @Transform(({ value }: TransformFnParams) => Number(value))
  page?: number = 1;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sortBy?: string = 'created_at';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsEnum(TaskStatus)
  filter?: TaskStatus;
}
