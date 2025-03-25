import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { TypeEnum } from 'src/config/contants';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateTransactionDto {
    @ApiProperty({ example: 100 })
    amount?: bigint;
    @ApiProperty({ example: "EXPENSE" })
    type?: TypeEnum;
    @ApiProperty({ example: "Hello World" })
    description?: string;
    @ApiProperty({ example: "2022-12-03"})
    date?: string;
    @ApiProperty({ example: 1 })
    categoryID?: number;
    @ApiProperty({example: "https://res.cloudinary.com/dlbbfck9n/image/upload/v1742833533/photo_2025-03-23_22-06-23_wmmmn4.jpg"})
    imageUrl?: string
}
