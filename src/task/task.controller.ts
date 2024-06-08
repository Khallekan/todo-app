import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { AccessJwtGuard } from 'src/auth/guard/jwt.guard';
import {
  GlobalResponseType,
  PaginatedDataResponseType,
} from 'src/types/response.type';
import { User } from 'src/user/entities';

import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { CreateTaskService } from './services/create-task.service';
import { DeleteTaskService } from './services/delete-task.service';
import { EditTaskService } from './services/edit-task.service';
import { GetTasksService } from './services/get-task.service';

@UseGuards(AccessJwtGuard)
@Controller('task')
export class TaskController {
  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly editTaskService: EditTaskService,
    private readonly getTasksService: GetTasksService,
    private readonly deleteTaskService: DeleteTaskService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): GlobalResponseType {
    return this.createTaskService.createTask(createTaskDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/edit/:taskId')
  editTask(
    @Body() editTaskDto: EditTaskDto,
    @GetUser() user: User,
    @Param('taskId') taskId: string,
  ): GlobalResponseType {
    return this.editTaskService.editTask(editTaskDto, user, taskId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  getTasks(
    @Query() getTasksDto: GetTasksDto,
    @GetUser() user: User,
  ): PaginatedDataResponseType {
    return this.getTasksService.getTasks(getTasksDto, user);
  }

  // hard delete
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:taskId')
  deleteTask(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
  ): GlobalResponseType {
    return this.deleteTaskService.deleteTask(taskId, user);
  }

  // soft delete
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:taskId/soft')
  softDeleteTask(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
  ): GlobalResponseType {
    return this.deleteTaskService.deleteTaskSoft(taskId, user);
  }
}
