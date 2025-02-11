import { ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum, RoleEnum } from 'src/config/contants';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'dynann' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'ran' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'dynannran' })
  username?: string;

  @ApiPropertyOptional({ example: 'dynann@gmail.com' })
  email?: string;

  @ApiPropertyOptional({ example: '2005-01-01T00:00:00.000Z', type: String })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  profileURL?: string;

  @ApiPropertyOptional({ enum: GenderEnum, example: 'MALE' })
  gender?: GenderEnum;

  @ApiPropertyOptional({ enum: RoleEnum, example: 'ADMIN' })
  role?: RoleEnum;
}
