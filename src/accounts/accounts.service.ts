import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBalanceZod } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: Prisma.AccountCreateInput) {
    try {
      const account = await this.prisma.account.create({
        data: createAccountDto
      })
      return account  
    } catch (error) {
      throw new HttpException(`Error occured: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      return await this.prisma.account.findMany()
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.account.findUnique({ where: {
        id: id
      }})
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateAccountDto: Prisma.AccountUpdateInput) {
    try {
      const res = await this.findOne(id)
      if(!res){
        throw new HttpException('account already exists', HttpStatus.BAD_REQUEST)
      }
      return await this.prisma.account.update({
        where: { id: id },
        data: updateAccountDto
      })
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.account.delete({ where: {
        id: id
      }})
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async updateBalance(data: UpdateBalanceZod){
    try {
      //todo using transaction to lock the row 
       return await this.prisma.$transaction(async (prisma) => {
       const record = await prisma.account.findUnique({
        where: {
          id: data.account,
          userID: data.user,
        },
        select: { id: true, balance: true }
       })
       if(!record){
        throw new HttpException('no account was found', HttpStatus.NOT_FOUND)
       }
       return await prisma.account.update({
        where: { id: data.account },
        data: { balance: data.balance }
       })
      })
    } catch (error) {
      throw new HttpException(`Error occurred: ${error}`, HttpStatus.NOT_FOUND)
    }
  }
}
