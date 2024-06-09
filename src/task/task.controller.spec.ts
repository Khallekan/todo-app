import { CanActivate, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessJwtGuard } from 'src/auth/guard/jwt.guard';
import * as request from 'supertest';

import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { CreateTaskService } from './services/create-task.service';
import { DeleteTaskService } from './services/delete-task.service';
import { EditTaskService } from './services/edit-task.service';
import { GetTasksService } from './services/get-task.service';
import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controller: TaskController;
  let app: INestApplication;

  let createTaskService: CreateTaskService;
  let editTaskService: EditTaskService;
  let getTasksService: GetTasksService;
  let deleteTasksService: DeleteTaskService;

  const fakeGuard: CanActivate = {
    canActivate: async () => true,
  };

  const taskDeletedMessage = 'Task deleted successfully';
  const mockCreateTaskService = {
    createTask: jest.fn(),
  };

  const mockEditTaskService = {
    editTask: jest.fn(),
  };

  const mockGetTasksService = {
    getTasks: jest.fn(),
  };

  const mockDeleteTasksService = {
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
        { provide: DeleteTaskService, useValue: mockDeleteTasksService },
      ],
    })
      .overrideGuard(AccessJwtGuard)
      .useValue(fakeGuard)
      .compile();

    controller = module.get<TaskController>(TaskController);
    createTaskService = module.get<CreateTaskService>(CreateTaskService);
    editTaskService = module.get<EditTaskService>(EditTaskService);
    deleteTasksService = module.get<DeleteTaskService>(DeleteTaskService);
    getTasksService = module.get<GetTasksService>(GetTasksService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/task (POST)', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
      };

      jest.spyOn(createTaskService, 'createTask').mockResolvedValue({
        message: 'Task created successfully',
      });

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .set('Authorization', `Bearer ACCESS_TOKEN`);

      expect(response.status).toBe(HttpStatus.CREATED);

      expect(response.body.message).toBe('Task created successfully');
    });
  });

  describe('/task/edit/:taskId (PUT)', () => {
    it('should edit an existing task', async () => {
      const editTaskDto: EditTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const taskUpdatedMessage = 'Task updated successfully';
      jest.spyOn(editTaskService, 'editTask').mockResolvedValue({
        message: taskUpdatedMessage,
      });

      await request(app.getHttpServer())
        .put('/task/edit/1')
        .send(editTaskDto)
        .set('Authorization', `Bearer ACCESS_TOKEN`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe(taskUpdatedMessage);
        });
    });
  });

  describe('/task (GET)', () => {
    it('should get paginated tasks', async () => {
      const getTasksDto: GetTasksDto = {
        page: 1,
        limit: 10,
      };

      jest.spyOn(getTasksService, 'getTasks').mockResolvedValue({
        message: 'Task updated successfully',
        data: {
          data: [],
          count: 0,
          last_page: 1,
          next: null,
          page: 1,
          previous: null,
        },
      });

      return request(app.getHttpServer())
        .get('/task')
        .query(getTasksDto)
        .set('Authorization', `Bearer ACCESS_TOKEN`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.data).toBeInstanceOf(Array);
        });
    });
  });

  describe('/task/delete/:taskId (DELETE)', () => {
    it('should hard delete a task', async () => {
      jest.spyOn(deleteTasksService, 'deleteTask').mockResolvedValue({
        message: taskDeletedMessage,
      });

      return request(app.getHttpServer())
        .delete('/task/delete/1')
        .set('Authorization', `Bearer ACCESS_TOKEN`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe(taskDeletedMessage);
        });
    });
  });

  describe('/task/delete/:taskId/soft (DELETE)', () => {
    it('should soft delete a task', async () => {
      jest.spyOn(deleteTasksService, 'deleteTaskSoft').mockResolvedValue({
        message: taskDeletedMessage,
      });
      return request(app.getHttpServer())
        .delete('/task/delete/1/soft') // replace '1' with the actual task ID
        .set('Authorization', `Bearer ACCESS_TOKEN`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe(taskDeletedMessage);
        });
    });
  });
});
