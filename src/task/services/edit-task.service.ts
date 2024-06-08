import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { GlobalResponseType } from 'src/types/response.type';
import { User } from 'src/user/entities';

import { EditTaskDto } from '../dto/edit-task.dto';
import { TaskRepository } from '../repository/task.repository';

@Injectable()
export class EditTaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async editTask(
    { description, title, status }: EditTaskDto,
    user: User,
    taskId: string,
  ): GlobalResponseType {
    if (!isUUID(taskId)) {
      throw new BadRequestException('Invalid task id');
    }

    const task = await this.taskRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (description) {
      task.description = description;
    }

    if (title) {
      task.title = title;
    }

    if (status) {
      task.status = status;
    }

    await task.save();

    return {
      message: 'Task updated successfully',
      data: task,
    };
  }
}
