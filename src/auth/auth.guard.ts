import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from 'src/config/contants';
import { Request } from 'express';
import { Payload } from '@prisma/client/runtime/library';
import { PayloadDto } from './dto/type.dto';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; 
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
  
    if (!token) {
      console.log(" you can't do it by the way ")
      throw new UnauthorizedException();
    }
    try {
      const payload: PayloadDto = await this.jwtService.verifyAsync(token, {
        secret: jwtConstant.secret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
