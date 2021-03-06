import { GetTasksTilterDto } from "src/tasks/dto/get-tasks-filter.dto";
import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async getTasks(
        filterDto: GetTasksTilterDto,
    ): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto,): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = await new Task();
        console.log("in repository:::", task);

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task
    }
}




