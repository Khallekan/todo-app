import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/entities';

import { CreateTaskService } from './create-task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repository/task.repository';

describe('CreateTaskService', () => {
  let service: CreateTaskService;
  let taskRepository: TaskRepository;
  const taskDescription = 'This is a test task';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskService,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateTaskService>(CreateTaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task successfully', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: taskDescription,
    };

    const user = {
      id: 'id',
      name: 'John Doe',
      email: 'john@example.com',
      // add other properties of User
    };

    const task = {
      id: '1',
      title: 'Test Task',
      description: taskDescription,
      save: jest.fn().mockResolvedValue(true),
      // add other properties of Task
    };

    jest
      .spyOn(taskRepository, 'create')
      .mockReturnValue(task as unknown as Task);

    const result = await service.createTask(
      createTaskDto,
      user as unknown as User,
    );

    expect(taskRepository.create).toHaveBeenCalledWith({
      ...createTaskDto,
      user,
    });
    expect(task.save).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Task created successfully',
      data: task,
    });
  });
});
