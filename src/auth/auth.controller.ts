import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  async login() {
    return 'this will log user in';
  }

  @Post('logout')
  async logout() {
    return 'this will log user in';
  }
}
