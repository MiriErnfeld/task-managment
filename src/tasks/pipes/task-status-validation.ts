import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../tasks.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: any) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(value + "is not a valid status")
        }
        return value;
    }

    private isStatusValid(status: any) {
        let ind = this.allowedStatuses.indexOf(status);
        return ind !== -1;
    }
}