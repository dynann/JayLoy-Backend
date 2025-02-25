import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto, PayloadDto } from './dto/type.dto';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: PayloadDto = {sub: user.id, role: user.role };
    const tokens = await this.generateTokens(payload);
    return tokens;
  }

  //todo to generate token
  async generateTokens(payload: PayloadDto) {
    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.REFRESH_JWT_EXPIRED,
      });
      await this.userService.updateRefreshToken(payload.sub, refreshToken)
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("found you")
      throw new HttpException(`error: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  //todo refresh token
  async refreshToken(refreshToken: string) {
    try {
  
      const payload: PayloadDto = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findOne(payload.sub);
      if(!user){
        throw new HttpException('user not found', HttpStatus.BAD_REQUEST)
      }
      if (user.refreshToken === refreshToken){
        return this.generateTokens({ sub: user.id, role: user.role });
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
