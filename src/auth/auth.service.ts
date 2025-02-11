import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from 'src/config/contants';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/type.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}
    
    async login(loginDto: LoginDto) {
        const user = await this.userService.validateUser(loginDto.email, loginDto.password)
        if (!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.role);
        return tokens 
    }

    async generateTokens(userId: number, role: string) {
        const accessToken = this.jwtService.sign(
          { sub: userId, role},
          { secret: jwtConstant.secret, expiresIn: '15m' },
        );
        return { accessToken };
      }

}
