import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAccountDto, UpdateBalanceZod } from './dto/create-account.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { bigint } from 'zod';
import { error } from 'console';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService, private transactionService: TransactionsService) {}

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

  async insertTransaction(id: number, createTransactionDto: CreateTransactionDto){
    try {
      const accountId = (await this.findByUserId(id)).id;
      const amount = BigInt(createTransactionDto.amount * 100)
      const transaction = await this.transactionService.create({
      amount: amount,
      type: createTransactionDto.type,
      description: createTransactionDto.description,
      date: new Date(createTransactionDto.date),
      category: {
        connect: {
          id: createTransactionDto.categoryID
        }
      },
      account: {
        connect: {
          id: accountId,
        }
      }
    }
    )
    const updateAccountBalance = await this.updateBalance(accountId, amount, transaction.type);
    return "Succesfully Created";
    }
    catch (err){
      throw new HttpException(`Error occured: ${err}`, HttpStatus.BAD_REQUEST);
    }
  }
  async findAllAccountTransaction(id: number){
    const accountId = (await this.findByUserId(id)).id;
    return await this.transactionService.findAllByAccountId(accountId);
  }

  async findAll() {
    try {
      return await this.prisma.account.findMany()
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findByUserId(id: number) {
    try {
      const account = await this.prisma.account.findFirst({ where: {
        userID: id
      }})
      return new GetAccountDto(account);
    } catch (error) {
      throw new HttpException(`Error Occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateAccountDto: Prisma.AccountUpdateInput) {
    try {
      const res = await this.findByUserId(id)
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

  async updateBalance(id: number, amount: bigint, type: string){
    try { 
       return await this.prisma.$transaction(async (prisma) => {
       const record = await prisma.account.findUnique({
        where: {
          id: id,
        },
        select: { id: true, balance: true }
       })
       if(!record){
        throw new HttpException('no account was found', HttpStatus.NOT_FOUND)
       }
       if (type === "EXPENSE"){
          return await prisma.account.update({
          where: { id: id },
          data: { balance: {decrement: amount} }
         })
       } 
       else {
        return await prisma.account.update({
          where: { id: id },
          data: { balance: {increment: amount}}
         })
       }
      })
    } catch (error) {
      throw new HttpException(`Error occurred: ${error}`, HttpStatus.NOT_FOUND)
    }
  }
  
  async totalExpenseEachMonth(userID: number, year: number){
    try {
      const account = (await this.findByUserId(userID)).id
      const transactions = await this.prisma.transaction.findMany({
        where: {
          type: 'EXPENSE',
          date: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`)
          },
          accountID: account,
        },
        select: {
          amount: true,
          date: true,
        }
      })
      const monthlyExpense = new Array(12).fill(0)
      transactions.forEach((transaction) => {
        const month = transaction.date.getMonth()
        monthlyExpense[month] += Number(transaction.amount)
      })
      const expense = [
        {'jan': monthlyExpense[0]},
        {'feb': monthlyExpense[1]},
        {'mar': monthlyExpense[2]},
        {'apr': monthlyExpense[3]},
        {'may': monthlyExpense[4]},
        {'jun': monthlyExpense[5]},
        {'jul': monthlyExpense[6]},
        {'aug': monthlyExpense[7]},
        {'sep': monthlyExpense[8]},
        {'oct': monthlyExpense[9]},
        {'nov': monthlyExpense[10]},
        {'dec': monthlyExpense[11]},

      ]
      return expense
    } catch (error) {
      throw new BadRequestException(`error ${error}`)
    }
  }

  async getAccountBalance(userID: number){
    const account = await this.findByUserId(userID);
    return {"amount": Number(account.balance)};
  }

  async getYearlyReport(userID: number, year: number){
    const account = (await this.findByUserId(userID)).id;
    const totalIncome = await this.prisma.transaction.aggregate({
      _sum: {amount: true},
      where: {
        type: "INCOME",
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        },
        accountID: account,
        
      }
    });
    const totalExpense = await this.prisma.transaction.aggregate({
      _sum: {amount: true},
      where: {
        type: "EXPENSE",
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        },
        accountID: account,
      }
    })
    const totalRemaining = Number(totalIncome._sum.amount) - Number(totalExpense._sum.amount);
    const report = {
      "total_income": Number(totalIncome._sum.amount),
      "total_expense": Number(totalExpense._sum.amount),
      "total_remaining": Number(totalRemaining)
    }
    return report;
  }

}
