import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, GetUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Public } from 'src/auth/public.decorator';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post()
  @ApiProperty({ title: 'create one user', type: CreateUserDto })
  @ApiOperation({ summary: 'create one user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    console.log(createUserDto)
    return this.usersService.createOne(createUserDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [GetUserDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one user' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: GetUserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'update one user' })
  @ApiProperty({ type: UpdateUserDto })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  async update(
    @Request() req,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'update password' })
  @ApiQuery({ name: 'newPassword', type: String, required: true })
  @ApiQuery({ name: 'oldPassword', type: String, required: true })
  @ApiResponse({ status: 200, type: String })
  async updatePassword(@Request() req, @Query('password') newPassword: string, @Query('oldPassword') oldPassword: string) {
    return this.usersService.updatePassword(req.user.sub, newPassword, oldPassword);
  }

  @Delete()
  @ApiOperation({ summary: 'delete one user' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @HttpCode(HttpStatus.OK) 
  async remove(@Request() req) {
    return this.usersService.remove(req.user.sub);
  }
}