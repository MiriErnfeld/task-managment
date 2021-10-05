import { from } from "rxjs";
import { TaskStatus } from "../tasks.model";
import {IsOptional, IsIn} from 'class-validator'
export class GetTasksTilterDto {
    @IsOptional()
    status: TaskStatus;
    search: string
}