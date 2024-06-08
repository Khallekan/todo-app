import { Injectable } from '@nestjs/common';
import { PaginatedDataResponseType } from 'src/types/response.type';
import { User } from 'src/user/entities';
import { parsePaginatedData } from 'src/utility-functions/parse-paginated-data.utility';
import { SelectQueryBuilder } from 'typeorm';

import { GetTasksDto } from '../dto/get-tasks.dto';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repository/task.repository';

@Injectable()
export class GetTasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasks(
    { limit, page, search, filter, sortBy, sortOrder }: GetTasksDto,
    user: User,
  ): PaginatedDataResponseType {
    const queryBuilder: SelectQueryBuilder<Task> = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id });

    if (search) {
      queryBuilder.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (filter) {
      queryBuilder.andWhere('task.status = :status', { status: filter });
    }

    const [tasks, count] = await queryBuilder
      .orderBy(`task.${sortBy}`, sortOrder)
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.created_at',
        'task.updated_at',
      ])
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      message: 'Tasks fetched successfully',
      data: parsePaginatedData({ count, data: tasks, limit, page }),
    };
  }
}
