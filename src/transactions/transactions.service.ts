import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService){}

  async create(createTransactionDto: Prisma.TransactionCreateInput) {
    const transaction = await this.prisma.transaction.create({data: createTransactionDto});
    return transaction;
  }

  async findAll(where: any) {
    console.log('query:', where)
    const transaction = await this.prisma.transaction.findMany({ where });
    return transaction.map(tx => ({
      ...tx,
      amount: tx.amount ? tx.amount.toString() : tx.amount,
    }));
  }
  async findAllByAccountId(id: number) {
    const transaction = await this.prisma.transaction.findMany({
      where: {
        accountID: id,
      },
    });
    return transaction.map((transaction) => new GetTransactionDto(transaction));
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: id,
      }
    })
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const updateTransaction = await this.prisma.transaction.update({
      where: {id: id},
      data: {
        amount: updateTransactionDto.amount,
        type: updateTransactionDto.type,
        description: updateTransactionDto.description,
        date: new Date(updateTransactionDto.date),
        categoryID: updateTransactionDto.categoryID
      },
    })
    return "Successfully updated";
  }

  async remove(id: number) {
    const transaction = await this.prisma.transaction.delete({
      where: {
        id: id,
      }
    })
    return transaction;
  }
}
