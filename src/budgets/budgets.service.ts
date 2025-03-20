import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBudgetDto, GetBudgetDto, UpdateBudgetDto } from './dto/create-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BudgetsService {

  constructor(private prisma: PrismaService) {}

  async createBudget(userID: number , createBudgetDto: CreateBudgetDto) {
    try {
      const createBudget = await this.prisma.budget.create({
        data: {
          amount: createBudgetDto.amount,
          userID: userID,
        }
      })
      const budget = new GetBudgetDto(createBudget)
      return budget
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAllBudget(where: any) {
    // console.log(where)
    try {
      const budgets = await this.prisma.budget.findMany(where)
      return budgets.map(budget => new GetBudgetDto(budget))
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findOneBudget(userID: number ) {
    try {
      const getBudget = await this.prisma.budget.findFirst({ 
        where: {
          userID: userID,
        }
      })
      if(!getBudget){
        return null
      }
      const budget = new GetBudgetDto(getBudget)
      return budget
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async getAllMyBudgets(userID: number){
    try {
      const budgets = await this.prisma.budget.findMany({
        where: { 
          userID: userID
        }
      })
      return budgets.map( budget => new GetBudgetDto(budget))
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async updateOneBudget(userID: number, updateBudgetDto: UpdateBudgetDto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        if(!this.findOneBudget(userID)){
          return null;
        }
        const updateData: any = {...updateBudgetDto};
        if (updateBudgetDto.startDate){
          updateData.startDate = new Date(updateBudgetDto.startDate);
        }
  
        if (updateBudgetDto.endDate){
          updateData.endDate = new Date(updateBudgetDto.endDate);
        }
        const update = await this.prisma.budget.update({
          where: {
            userID: userID,
          },
          data: updateData
        })
        return new GetBudgetDto(update)
      })
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async removeOneBudget(userID: number, id: number) {
    try {
      if(!this.findOneBudget(userID)) {
        return null
      }
      const deleteBudget = await this.prisma.budget.delete({
        where: {
          id: id,
          userID: userID,
        }
      })
      return new GetBudgetDto(deleteBudget)
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }
}