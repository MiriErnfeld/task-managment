import { from } from "rxjs";
import { TaskStatus } from "../task-status.enum";
import {IsOptional, IsIn} from 'class-validator'
export class GetTasksTilterDto {
    @IsOptional()
    status: TaskStatus;
    search: string
}