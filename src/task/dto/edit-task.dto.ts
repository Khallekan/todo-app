import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '../entities/task.entity';

export class EditTaskDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
