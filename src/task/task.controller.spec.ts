import { Test, TestingModule } from '@nestjs/testing';

import { CreateTaskService } from './services/create-task.service';
import { DeleteTaskService } from './services/delete-task.service';
import { EditTaskService } from './services/edit-task.service';
import { GetTasksService } from './services/get-task.service';
import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controller: TaskController;

  const mockCreateTaskService = {
    createTask: jest.fn(),
  };

  const mockEditTaskService = {
    editTask: jest.fn(),
  };

  const mockGetTasksService = {
    getTasks: jest.fn(),
  };

  const deleteTasksService = {
    deleteTask: jest.fn(),
    deleteTaskSoft: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: CreateTaskService, useValue: mockCreateTaskService },
        { provide: EditTaskService, useValue: mockEditTaskService },
        { provide: GetTasksService, useValue: mockGetTasksService },
        { provide: DeleteTaskService, useValue: deleteTasksService },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
