import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { bigint } from 'zod';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService){}

  async create(createTransactionDto: Prisma.TransactionCreateInput) {
    const transaction = await this.prisma.transaction.create({data: createTransactionDto});
    return transaction;
  }
  
  async findAll(userID: number ,where: any) {
    // console.log(userID)
    const account = await this.prisma.account.findFirst({
      where: {
        userID: userID
      }
    })
    where.accountID = account.id
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
    console.log(transaction)
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

  toIntegerCents(value: number | string | bigint): number {
    if (typeof value === 'bigint') {
      value = value.toString();
    }
    const str = typeof value === "string" ? value : value.toFixed(2);
    const [integer, decimal = "00"] = str.split(".");
    return parseInt(integer + decimal.padEnd(2, "0").slice(0, 2), 10);
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({where: {id: id}});
    await this.prisma.$transaction(async (tx) => {
      if (transaction.type === "EXPENSE"){
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {increment: transaction.amount} 
          }
        })
      }
      else{
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {decrement: transaction.amount}
          }
        })
      }
      const amountValue = typeof updateTransactionDto.amount === 'bigint' 
        ? Number(updateTransactionDto.amount) 
        : updateTransactionDto.amount;
      const amountInCents = BigInt(this.toIntegerCents(amountValue));
      
      if (updateTransactionDto.type === "EXPENSE"){
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {decrement: amountInCents} 
          }
        })
      }
      else {
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {increment: amountInCents} 
          }
        })
      }
    })
    
    const transactionAmountValue = typeof updateTransactionDto.amount === 'bigint' 
      ? Number(updateTransactionDto.amount) 
      : updateTransactionDto.amount;
    const transactionAmountInCents = BigInt(this.toIntegerCents(transactionAmountValue));
    
    const updateTransaction = await this.prisma.transaction.update({
      where: {id: id},
      data: {
        amount: transactionAmountInCents,
        type: updateTransactionDto.type,
        description: updateTransactionDto.description,
        date: new Date(updateTransactionDto.date),
        categoryID: updateTransactionDto.categoryID
      },
    })

    return "Successfully updated";
  }

  async remove(id: number) {
    const transaction = await this.prisma.transaction.findUnique({where: {id: id}});
    const account = await this.prisma.account.findUnique({where: {id: transaction.accountID}});
    await this.prisma.$transaction(async (tx) => {
      if (transaction.type === "EXPENSE"){
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {increment: transaction.amount} 
          }
        })
      }
      else{
        await this.prisma.account.update({
          where: {id: transaction.accountID},
          data: {
            balance: {decrement: transaction.amount}
          }
        })
      }
    })

    await this.prisma.transaction.delete({
      where: {
        id: id,
      }
    })
    return "Successfully deleted";
  }

  async summarize(userID: number){
    try {
      const where: any = {}
      const transactions = await this.findAll(userID, where)
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }
}
