import { BadRequestException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { GlobalResponseType } from 'src/types/response.type';
import { User } from 'src/user/entities';

import { TaskRepository } from '../repository/task.repository';

@Injectable()
export class DeleteTaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async deleteTask(taskId: string, user: User): GlobalResponseType {
    if (!isUUID(taskId)) {
      throw new BadRequestException('Invalid task id');
    }

    const task = await this.taskRepository.delete({
      id: taskId,
      user: user,
    });

    if (!task.affected) {
      throw new BadRequestException('Task not found');
    }

    return {
      message: 'Task deleted successfully',
      data: null,
    };
  }

  async deleteTaskSoft(taskId: string, user: User): GlobalResponseType {
    if (!isUUID(taskId)) {
      throw new BadRequestException('Invalid task id');
    }

    const task = await this.taskRepository.softDelete({
      id: taskId,
      user: user,
    });

    if (!task.affected) {
      throw new BadRequestException('Task not found');
    }

    return {
      message: 'Task deleted successfully',
      data: null,
    };
  }
}
