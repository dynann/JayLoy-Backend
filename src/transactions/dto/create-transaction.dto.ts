import { TypeEnum } from "src/config/contants"
import internal from "stream";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty({ example: 100 })
    amount: number;
    @ApiProperty({ example: 'EXPENSE'})
    type: TypeEnum;
    @ApiProperty({ example: 'I bought cake' })
    description: string;
    @ApiProperty({  example: '2025-12-31'})
    date: string;
    @ApiProperty({ example: 1 })
    categoryID: number;
}

export class GetTransactionDto {
    @ApiProperty({ example: 100 })
    id: number;
    @ApiProperty({ example: 100 })
    amount: number;
    @ApiProperty({ example: 'EXPENSE'})
    type: TypeEnum;
    @ApiProperty({ example: 'I bought cake' })
    description: string;
    @ApiProperty({  example: '2025-12-31'})
    date: String;
    @ApiProperty({ example: 1 })
    categoryID: number;
    @ApiProperty({ example: 1 })
    accountID: number;
    constructor(transaction: any){
        this.id = transaction.id;
        this.amount = Number(transaction.amount);
        this.type = transaction.type;
        this.description = transaction.description;
        this.date = transaction.date;
        this.categoryID = transaction.categoryID;
        this.accountID = transaction.accountID;
    }
}

export class DateQueryDto {
    @ApiProperty({
      description: 'Date in YYYY-MM-DD format',
      example: '2025-02-25',
      required: false,
    })
    date!: string;
  }