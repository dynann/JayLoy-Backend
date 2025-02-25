import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService){}

  async create(createCurrencyDto: Prisma.CurrencyCreateInput) {
    return await this.prisma.currency.create({data: createCurrencyDto});
  }

  findAll() {
    return `This action returns all currencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} currency`;
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return `This action updates a #${id} currency`;
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
