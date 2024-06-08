import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './entities/task.entity';
import { TaskRepository } from './repository/task.repository';
import { CreateTaskService } from './services/create-task.service';
import { DeleteTaskService } from './services/delete-task.service';
import { EditTaskService } from './services/edit-task.service';
import { GetTasksService } from './services/get-task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],

  controllers: [TaskController],

  providers: [
    // Repositories
    TaskRepository,

    // Services
    CreateTaskService,
    EditTaskService,
    GetTasksService,
    DeleteTaskService,
  ],
})
export class TaskModule {}
