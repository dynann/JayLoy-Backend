import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from 'src/config/contants';

export class CreateUserDto {
  @ApiProperty({ example: 'string' })
  firstName!: string;
  @ApiProperty({ example: 'string' })
  lastName!: string;
  @ApiProperty({ example: 'string' })
  username!: string;
  @ApiProperty({ example: 'string' })
  email: string;
  @ApiProperty({ example: 'string' })
  password: string;
  @ApiProperty({ example: Date })
  dateOfBirth!: Date;
  @ApiProperty({ example: 'string' })
  profileUrl!: Date;
  @ApiProperty({ enum: ['MALE', 'FEMALE'] })
  gender: GenderEnum;
}
