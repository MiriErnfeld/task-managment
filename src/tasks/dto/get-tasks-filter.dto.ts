import { TaskStatus } from '../task-status.enum';
import { IsOptional } from 'class-validator';
export class GetTasksTilterDto {
  @IsOptional()
  status: TaskStatus;
  @IsOptional()
  search: string;
}
