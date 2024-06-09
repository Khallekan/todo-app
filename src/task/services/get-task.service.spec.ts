import { Test, TestingModule } from '@nestjs/testing';
import { SortOrder } from 'src/types/sort-order.type';
import { User } from 'src/user/entities';
import { parsePaginatedData } from 'src/utility-functions/parse-paginated-data.utility';

import { GetTasksService } from './get-task.service';
import { GetTasksDto } from '../dto/get-tasks.dto';
import { TaskStatus } from '../entities/task.entity';
import { TaskRepository } from '../repository/task.repository';

jest.mock('src/utility-functions/parse-paginated-data.utility');

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'open',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    status: 'open',
    created_at: new Date(),
    updated_at: new Date(),
  },
];
export const mockRepositoryFactory = () => {
  const mockDeleteSingleton = jest.fn().mockReturnThis();
  const mockExecuteSingleton = jest.fn().mockReturnThis();
  const mockFromSingleton = jest.fn().mockReturnThis();
  const mockGetManySingleton = jest.fn().mockReturnThis();
  const mockGetOneSingleton = jest.fn().mockReturnThis();
  const mockInnerJoinSingleton = jest.fn().mockReturnThis();
  const mockInnerJoinAndSelectSingleton = jest.fn().mockReturnThis();
  const mockOrderBySingleton = jest.fn().mockReturnThis();
  const mockWhereSingleton = jest.fn().mockReturnThis();
  const mockWhereSelect = jest.fn().mockReturnThis();
  const mockLeftJoinAndSelect = jest.fn().mockReturnThis();
  const mockTake = jest.fn().mockReturnThis();
  const mockSkip = jest.fn().mockReturnThis();
  const mockGetManyAndCount = jest.fn().mockResolvedValue([mockTasks, 2]);

  return {
    delete: mockDeleteSingleton,
    execute: mockExecuteSingleton,
    from: mockFromSingleton,
    getMany: mockGetManySingleton,
    getOne: mockGetOneSingleton,
    innerJoin: mockInnerJoinSingleton,
    innerJoinAndSelect: mockInnerJoinAndSelectSingleton,
    orderBy: mockOrderBySingleton,
    where: mockWhereSingleton,
    andWhere: mockWhereSingleton,
    select: mockWhereSelect,
    leftJoinAndSelect: mockLeftJoinAndSelect,
    take: mockTake,
    skip: mockSkip,
    getManyAndCount: mockGetManyAndCount,
  };
};

describe('GetTasksService', () => {
  let service: GetTasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTasksService,
        {
          provide: TaskRepository,
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetTasksService>(GetTasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch tasks with pagination', async () => {
    const repositoryFactory = mockRepositoryFactory();
    (taskRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      repositoryFactory,
    );

    (parsePaginatedData as jest.Mock).mockReturnValue({
      data: mockTasks,
      total: 2,
      page: 1,
      limit: 10,
    });

    const getTasksDto: GetTasksDto = {
      limit: 10,
      page: 1,
      search: 'test',
      filter: TaskStatus.TODO,
      sortBy: 'title',
      sortOrder: SortOrder.ASC,
    };

    const user = {
      id: 'something',
      email: 'test@example.com',
    } as unknown as User;

    const result = await service.getTasks(getTasksDto, user);

    expect(taskRepository.createQueryBuilder).toHaveBeenCalledWith('task');
    expect(repositoryFactory.leftJoinAndSelect).toHaveBeenCalledWith(
      'task.user',
      'user',
    );
    expect(repositoryFactory.andWhere).toHaveBeenCalledWith(
      'user.id = :userId',
      {
        userId: user.id,
      },
    );
    expect(repositoryFactory.andWhere).toHaveBeenCalledWith(
      'task.title ILIKE :search OR task.description ILIKE :search',
      { search: '%test%' },
    );
    expect(repositoryFactory.andWhere).toHaveBeenCalledWith(
      'task.status = :status',
      { status: TaskStatus.TODO },
    );
    expect(repositoryFactory.orderBy).toHaveBeenCalledWith(
      'task.title',
      SortOrder.ASC,
    );
    expect(repositoryFactory.select).toHaveBeenCalledWith([
      'task.id',
      'task.title',
      'task.description',
      'task.status',
      'task.created_at',
      'task.updated_at',
    ]);
    expect(repositoryFactory.take).toHaveBeenCalledWith(10);
    expect(repositoryFactory.skip).toHaveBeenCalledWith(0);
    expect(repositoryFactory.getManyAndCount).toHaveBeenCalled();

    expect(parsePaginatedData).toHaveBeenCalledWith({
      count: 2,
      data: mockTasks,
      limit: 10,
      page: 1,
    });
    expect(result).toEqual({
      message: 'Tasks fetched successfully',
      data: { data: mockTasks, total: 2, page: 1, limit: 10 },
    });
  });
});
