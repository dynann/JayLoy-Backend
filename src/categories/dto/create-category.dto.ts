import { ApiProperty } from "@nestjs/swagger";
import { TYPE } from "@prisma/client";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Food' })
    name: string;
    @ApiProperty({ example: 'EXPENSE' })
    type: TYPE;
}

export class GetCategoryDto {
    @ApiProperty({example: 'Food'})
    name: string;
    @ApiProperty({ example: 'EXPENSE'})
    type: TYPE;
    @ApiProperty({example: 1})
    userID: number;
}
