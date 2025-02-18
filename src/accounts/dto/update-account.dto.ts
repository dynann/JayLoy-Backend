import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @ApiProperty({ example: 'Visa Card' })
    name: string

    @ApiProperty({ example: 200 })
    balance: bigint;
}
