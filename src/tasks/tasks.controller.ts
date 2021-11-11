import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Task } from 'src/tasks/task.entity';
import { TaskStatus } from 'src/tasks/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksTilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }
  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    console.log("in controller get task bt id");

    return this.tasksService.getTaskById(id)
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksTilterDto,
  ): Promise<Task[]> {

    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log("in controller to delete");

    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,


  ): Promise<Task> {
    console.log("in controller update status!!!");
    return this.tasksService.updateTaskStatus(id, status);
  }

}
