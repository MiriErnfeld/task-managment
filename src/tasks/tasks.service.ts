import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksWithFiltered(filterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if (search)
    //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));

    //     return tasks;
    // }

    // createTask(createTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //     this.tasks.push(task);
    //     return task;
    // }

    // deleteTask(id: string): Task {
    //     const task = this.tasks.find(t => t.id === id);
    //     this.tasks = this.tasks.filter(t => t.id !== id);
    //     return task;
    // }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.tasks.find(t => t.id === id);
    //     task.status = status;
    //     return task;
    // }
}
