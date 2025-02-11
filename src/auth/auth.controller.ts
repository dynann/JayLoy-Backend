import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginProperty } from './dto/type.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiProperty({ title: 'login', type: LoginDto })
  @ApiOperation({ summary: 'log in' })
  @ApiBody({
    schema: {
      example: {
        email: 'dynann@gmail.com',
        password: 'hashedpassword',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto)
    return tokens
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }


  @Post('logout')
  async logout() {
    return 'this will log user in';
  }

  @Post('refresh')
  async refreshToken() {
    return 'token is refreshed';
  }
}
