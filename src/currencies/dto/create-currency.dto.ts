import { ApiProperty } from "@nestjs/swagger";
export class CreateCurrencyDto {
    @ApiProperty({ example: 'Dollar' })
    name: string;
}

export class GetCurrencyDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Riel' })
    name: string;
}
