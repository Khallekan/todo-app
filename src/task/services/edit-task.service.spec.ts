import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isUUID } from 'class-validator';
import { User } from 'src/user/entities';

import { EditTaskService } from './edit-task.service';
import { EditTaskDto } from '../dto/edit-task.dto';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repository/task.repository';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  isUUID: jest.fn(),
}));

describe('EditTaskService', () => {
  let service: EditTaskService;
  let taskRepository: TaskRepository;
  const userEmail = 'john@example.com';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditTaskService,
        {
          provide: TaskRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EditTaskService>(EditTaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if taskId is not a valid UUID', async () => {
    (isUUID as jest.Mock).mockReturnValue(false);

    const editTaskDto: EditTaskDto = { title: 'New Title' };
    const user = { id: '1', name: 'John Doe', email: userEmail };
    const taskId = 'invalid-uuid';

    await expect(
      service.editTask(editTaskDto, user as unknown as User, taskId),
    ).rejects.toThrow(BadRequestException);

    expect(isUUID).toHaveBeenCalledWith(taskId);
  });

  it('should throw NotFoundException if task is not found', async () => {
    (isUUID as jest.Mock).mockReturnValue(true);
    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

    const editTaskDto: EditTaskDto = { title: 'New Title' };
    const user = { id: '1', name: 'John Doe', email: userEmail };
    const taskId = 'valid-uuid';

    await expect(
      service.editTask(editTaskDto, user as unknown as User, taskId),
    ).rejects.toThrow(NotFoundException);

    expect(taskRepository.findOne).toHaveBeenCalledWith({
      where: {
        user: { id: user.id },
        id: taskId,
      },
    });
  });

  it('should update the task successfully', async () => {
    (isUUID as jest.Mock).mockReturnValue(true);

    const editTaskDto: EditTaskDto = {
      title: 'Updated Title',
      description: 'Updated Description',
    };
    const user = { id: '1', name: 'John Doe', email: userEmail };
    const taskId = 'valid-uuid';

    const task = {
      id: '1',
      title: 'Old Title',
      description: 'Old Description',
      user: user as unknown as User,
      save: jest.fn().mockResolvedValue(true),
    };

    jest
      .spyOn(taskRepository, 'findOne')
      .mockResolvedValue(task as unknown as Task);

    const result = await service.editTask(
      editTaskDto,
      user as unknown as User,
      taskId,
    );

    expect(taskRepository.findOne).toHaveBeenCalledWith({
      where: {
        user: { id: user.id },
        id: taskId,
      },
    });

    expect(task.title).toBe(editTaskDto.title);
    expect(task.description).toBe(editTaskDto.description);
    expect(task.save).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Task updated successfully',
      data: task,
    });
  });
});
