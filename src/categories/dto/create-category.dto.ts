import { ApiProperty } from "@nestjs/swagger";
import { TYPE } from "@prisma/client";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Food' })
    name: bigint;
    @ApiProperty({ example: 'EXPENSE' })
    type: TYPE;
}
