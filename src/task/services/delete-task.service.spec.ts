import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isUUID } from 'class-validator';
import { User } from 'src/user/entities';

import { DeleteTaskService } from './delete-task.service';
import { TaskRepository } from '../repository/task.repository';

// Mock the isUUID function
jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  isUUID: jest.fn(),
}));

describe('DeleteTaskService', () => {
  let service: DeleteTaskService;
  let taskRepository: TaskRepository;

  const userEmail = 'john@example.com';
  const validTaskId = 'valid-uuid';
  const invalidTaskId = 'invalid-uuid';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskService,
        {
          provide: TaskRepository,
          useValue: {
            delete: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteTaskService>(DeleteTaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteTask', () => {
    it('should throw BadRequestException if taskId is not a valid UUID', async () => {
      (isUUID as jest.Mock).mockReturnValue(false);

      const user = {
        id: '1',
        email: userEmail,
      };

      await expect(
        service.deleteTask(invalidTaskId, user as unknown as User),
      ).rejects.toThrow(BadRequestException);

      expect(isUUID).toHaveBeenCalledWith(invalidTaskId);
    });

    it('should throw BadRequestException if task is not found', async () => {
      (isUUID as jest.Mock).mockReturnValue(true);
      jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });

      const user = {
        id: '1',
        email: userEmail,
      };

      await expect(
        service.deleteTask(validTaskId, user as unknown as User),
      ).rejects.toThrow(BadRequestException);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: validTaskId,
        user,
      });
    });

    it('should delete the task successfully', async () => {
      (isUUID as jest.Mock).mockReturnValue(true);
      jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      const user = {
        id: '1',
        email: userEmail,
      };

      const result = await service.deleteTask(
        validTaskId,
        user as unknown as User,
      );

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: validTaskId,
        user,
      });
      expect(result).toEqual({
        message: 'Task deleted successfully',
        data: null,
      });
    });
  });

  describe('deleteTaskSoft', () => {
    it('should throw BadRequestException if taskId is not a valid UUID', async () => {
      (isUUID as jest.Mock).mockReturnValue(false);

      const user = {
        id: '1',
        email: userEmail,
      };

      await expect(
        service.deleteTaskSoft(invalidTaskId, user as unknown as User),
      ).rejects.toThrow(BadRequestException);

      expect(isUUID).toHaveBeenCalledWith(invalidTaskId);
    });

    it('should throw BadRequestException if task is not found', async () => {
      (isUUID as jest.Mock).mockReturnValue(true);
      jest
        .spyOn(taskRepository, 'softDelete')
        .mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });

      const user = {
        id: '1',
        email: userEmail,
      };

      await expect(
        service.deleteTaskSoft(validTaskId, user as unknown as User),
      ).rejects.toThrow(BadRequestException);

      expect(taskRepository.softDelete).toHaveBeenCalledWith({
        id: validTaskId,
        user,
      });
    });

    it('should soft delete the task successfully', async () => {
      (isUUID as jest.Mock).mockReturnValue(true);
      jest
        .spyOn(taskRepository, 'softDelete')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const user = {
        id: '1',
        email: userEmail,
      };

      const result = await service.deleteTaskSoft(
        validTaskId,
        user as unknown as User,
      );

      expect(taskRepository.softDelete).toHaveBeenCalledWith({
        id: validTaskId,
        user,
      });
      expect(result).toEqual({
        message: 'Task deleted successfully',
        data: null,
      });
    });
  });
});
