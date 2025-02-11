import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum, RoleEnum } from 'src/config/contants';

export class CreateUserDto {
  @ApiProperty({ example: 'dynann' })
  firstName!: string;
  @ApiProperty({ example: 'ran' })
  lastName!: string;
  @ApiProperty({ example: 'fidynann' })
  username!: string;
  @ApiProperty({ example: 'dynann@gmail.com' })
  email: string;
  @ApiProperty({ example: 'hashedpassword' })
  password: string;
  @ApiProperty({ example: '2005-01-01T00:00:00.000Z', type: String })
  dateOfBirth!: string;
  @ApiProperty({
    example:
      'https://external-preview.redd.it/what-is-your-review-about-the-gleam-programming-language-v0-9ZK3KN0GhFM2K1uE0CdhJhqebMdXVfbD_ED-OsliG60.jpg?auto=webp&s=671464f8a6fbd694636808bf83c765a6aaed1529',
  })
  profileURL!: string;
  @ApiProperty({ enum: GenderEnum, example: 'MALE' })
  gender: GenderEnum;
}

export class GetUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'dynann' })
  firstName?: string;

  @ApiProperty({ example: 'ran' })
  lastName?: string;

  @ApiProperty({ example: 'dynannran' })
  username?: string;

  @ApiProperty({ example: 'dynann@gmail.com' })
  email: string;

  @ApiProperty({ example: 'mb8r3243ngdu234nt' })
  password: string;

  @ApiProperty({ example: '2005-01-01T00:00:00.000Z' })
  dateOfBirth?: Date;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Gleam_Lucy.svg/220px-Gleam_Lucy.svg.png',
  })
  profileURL?: string;

  @ApiProperty({ enum: GenderEnum, example: 'MALE' })
  gender: GenderEnum;

  @ApiProperty({ example: '2005-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: null })
  deletedAt?: Date;

  @ApiProperty({ enum: RoleEnum, example: 'USER' })
  role: RoleEnum;
}
