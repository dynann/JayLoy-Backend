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
  toIntegerCents(value: number | string): number {
    const str = typeof value === "string" ? value : value.toFixed(2);
    const [integer, decimal = "00"] = str.split(".");
    return parseInt(integer + decimal.padEnd(2, "0").slice(0, 2), 10);
  }
  async insertTransaction(id: number, createTransactionDto: CreateTransactionDto){
    try {
      if (createTransactionDto.amount == 0){
        return "Invalid amount!"
      }
      const accountId = (await this.findByUserId(id)).id;
      const amount = BigInt(this.toIntegerCents(createTransactionDto.amount))
      await this.prisma.$transaction(async (tx) => {
          await this.transactionService.create({
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
        
      })
      
    const updateAccountBalance = await this.updateBalance(accountId, amount, createTransactionDto.type);
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
        { month: "January", Expense: monthlyExpense[0] },
        { month: "February", Expense: monthlyExpense[1] },
        { month: "March", Expense: monthlyExpense[2] },
        { month: "April", Expense: monthlyExpense[3] },
        { month: "May", Expense: monthlyExpense[4] },
        { month: "June", Expense: monthlyExpense[5] },
        { month: "July", Expense: monthlyExpense[6] },
        { month: "August", Expense: monthlyExpense[7] },
        { month: "September", Expense: monthlyExpense[8] },
        { month: "October", Expense: monthlyExpense[9] },
        { month: "November", Expense: monthlyExpense[10] },
        { month: "December", Expense: monthlyExpense[11] },

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

  async verifyBalance(userId){
    const accountId = (await this.findByUserId(userId)).id;
    const totalIncome = await this.prisma.transaction.aggregate({
      _sum: {amount: true},
      where: {
        type: "INCOME",
        accountID: accountId,
        
      }
    });
    const totalExpense = await this.prisma.transaction.aggregate({
      _sum: {amount: true},
      where: {
        type: "EXPENSE",
        accountID: accountId,
      }
    })
    const totalBalance = totalIncome._sum.amount - totalExpense._sum.amount;
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: totalBalance}
     })
  }

}