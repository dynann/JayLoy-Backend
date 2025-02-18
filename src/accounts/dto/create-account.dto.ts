import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
export class CreateAccountDto {
    @ApiProperty({ example: 'Cash' })
    name: string

    @ApiProperty({ example: 2000 })
    balance: bigint
}

export class GetAccountDto {
    @ApiProperty({ example: 'string' })
    name: string

    @ApiProperty({ example: 'number' })
    balance: bigint
}

const updateBalanceZod = z.object({
    user: z.number(),
    account: z.number(),
    balance: z.number().min(1),
})

export class UpdateBalanceZod extends createZodDto(updateBalanceZod) {}

