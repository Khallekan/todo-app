import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'title cannot be empty' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'description cannot be empty' })
  @IsString({ message: 'description must be a string' })
  description: string;
}
