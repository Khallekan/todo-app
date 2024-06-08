import { Injectable } from '@nestjs/common';
import { GlobalResponseType } from 'src/types/response.type';
import { User } from 'src/user/entities';

import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repository/task.repository';

@Injectable()
export class CreateTaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): GlobalResponseType {
    const task = this.taskRepository.create({ ...createTaskDto, user });

    await task.save();

    const response: Partial<Task> = task;

    delete response.user;

    return {
      message: 'Task created successfully',
      data: response,
    };
  }
}
