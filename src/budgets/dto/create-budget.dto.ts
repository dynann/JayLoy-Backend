import { ApiProperty } from "@nestjs/swagger";
import * as dayjs from "dayjs"

export class CreateBudgetDto {
    @ApiProperty({ example: 1000 })
    amount: number;

    @ApiProperty({ example: dayjs() })
    startDate: string;

    @ApiProperty({ example: dayjs() })
    endDate: string;
}

export class GetBudgetDto {

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1000 })
    amount: number;

    @ApiProperty({ example: dayjs() })
    startDate: string;

    @ApiProperty({ example: dayjs() })
    endDate: string;

    @ApiProperty({ example: 1 })
    user: number;
    constructor(budget: any){
        this.id = budget.id
        this.amount = Number(budget.amount)
        this.startDate = budget.startDate
        this.endDate = budget.endDate
        this.user = budget.userID
    }
}

export class UpdateBudgetDto {
    @ApiProperty({ example: 1000 })
    amount?: number;

    @ApiProperty({ example: dayjs() })
    startDate?: string;

    @ApiProperty({ example: dayjs() })
    endDate?: string;
}

