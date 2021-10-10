import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksTilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(
    filterDto: GetTasksTilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    }
    catch (err) {
      this.logger.error('failed to get tasks for user , filters', err.stack);
      throw new InternalServerErrorException();

    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (err) {
      this.logger.error('failed to create a task for user , details', err.stack);
      throw new InternalServerErrorException()
    }
    delete task.user;
    return task;
  }
}