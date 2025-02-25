import { ApiProperty } from "@nestjs/swagger";
export class CreateCurrencyDto {
    @ApiProperty({ example: 'Dollar' })
    name: string;
    
}
