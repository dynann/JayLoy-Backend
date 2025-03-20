import { SetMetadata } from '@nestjs/common';
import * as dotenv from 'dotenv'
dotenv.config()

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SYSTEM = 'SYSTEM',    
}

export enum TypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}
export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstant = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECERT,
}
