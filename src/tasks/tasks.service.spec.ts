import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import {Test} from '@nestjs/testing'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksTilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () =>({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
})

const mockUser ={ username :'Test user', id:13};

describe('task service', ()=>{
    let tasksService;
    let taskRepository;

    beforeEach(async ()=>{
        const module=await Test.createTestingModule({
            providers: [TasksService, {provide: TaskRepository, useFactory: mockTaskRepository}],
        }).compile();
        tasksService=await module.get<TasksService>(TasksService);
        taskRepository=await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', ()=>{
        it('get all tasks from task repository', async()=>{
            taskRepository.getTasks.mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filterDto : GetTasksTilterDto={status:TaskStatus.OPEN, search: 'a' };
            const result =await tasksService.getTasks(filterDto, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        })
    })
    describe('getTaskById',() => {
        it('calls taskRepository.findOne() and returns task', async()=>{
            const mockTest= {title: 'someTitle', description: 'someDescription'};
            taskRepository.findOne.mockResolvedValue(mockTest);
            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTest);

            expect(taskRepository.findOne).toHaveBeenCalledWith({where:{id: 1, userId: mockUser.id}})
        })
        it('throw an error as task does not exist',()=>{
            taskRepository.findOne.mockResolvedValue(false);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    })
    describe('createTask', () => {
        it('create a new task by taskRepository.createTask',async () => {
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto={title: 'foo', description: 'bar'};
            taskRepository.createTask.mockResolvedValue('someTask');
            const result=await tasksService.createTask( createTaskDto,mockUser)
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someTask');

        })
    })

    describe('deleteTask',()=>{
        it('calls taskRepository.deleteTask to delete a task',async ()=>{
            taskRepository.delete.mockResolvedValue({affected:1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id:1,userId: mockUser.id });

        })
        it ('throw an error if task is not found',()=>{
            taskRepository.delete.mockResolvedValue({affected:0});
            expect(tasksService.deleteTask).rejects.toThrow(NotFoundException);
        })
    })
    describe('updateTaskStatus',() => {
        it('should update task status',async() => {
            const save=jest.fn().mockResolvedValue(true);
            tasksService.getTaskById= jest.fn().mockResolvedValue({status: TaskStatus.OPEN, save});
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result =await tasksService.updateTaskStatus(1, TaskStatus.IN_PROGRESS, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
            expect(save).toHaveBeenCalled();
        })
    })
})
