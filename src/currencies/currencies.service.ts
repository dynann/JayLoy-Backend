import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { date } from 'zod';
@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService){}

  async create(createCurrencyDto: Prisma.CurrencyCreateInput) {
    try {
      return await this.prisma.currency.create({data: createCurrencyDto});
    } catch  (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      return await this.prisma.currency.findMany()
    } catch (error) {
      throw new HttpException(`error occurred ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.currency.findUnique({ 
        where: {
          id: id
        }
      })
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      if(!this.findOne(id)){
        return 'currency not found'
      }
      const update = await this.prisma.currency.update({
        where: {
          id: id,
        },
        data: updateCurrencyDto
      })
      return update
    } catch (error) {
      throw new HttpException(`error occurred ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    try {
      if(!this.findOne(id)){
        return 'currency not found'
      }
      const deleted = await this.prisma.currency.delete({
        where: {
          id: id
        }
      })
      return deleted
    } catch (error ) { 
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }
}
