import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(userID: number, createCategoryDto: Prisma.CategoryCreateInput) {
    // console.log(createCategoryDto, userID)
    try {
      const categories = await this.prisma.category.create({data: {
        name: createCategoryDto.name,
        type: createCategoryDto.type,
        user: {
          connect: {
            id: userID
          }
        }
      }});
      return categories;
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
   
  }

  async findAllByUserID(where: any) {
    try {
      const categories = await this.prisma.category.findMany({ where })
      return categories
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: id
        }
      })
      return category
    } catch (error) {
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany()
      return categories
    } catch (error) {
      throw new HttpException(`error ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async summaryIncome(userId: number, page: number = 1, limit: number = 10, type: TYPE, month: any){
    try {
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(limit, 100));
      let where: any = {}
      where.date = undefined
      if(month){
        const startOfMonth = new Date(month + '-01T00:00:00.000Z');
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1, 0);
        where.date = {
          gte: startOfMonth,
          lte: new Date(endOfMonth.getFullYear(), endOfMonth.getMonth(), endOfMonth.getDate() + 1),
        };
        console.log(where.date)
      }
      
      const categoryTotals = await this.prisma.transaction.groupBy({
        by: ['categoryID'],
        where: {
          account: { userID: userId },
          ...(type && { category: { type } }),
          ...(month && {
            date: where.date,
          }),
        },
        _sum: { amount: true },
      });
      console.log('transaction: ', categoryTotals)
      const categories = await this.prisma.category.findMany({
        where: { 
          id: { in: categoryTotals.map(ct => ct.categoryID) },
          ...(type && { type })
        }
      });
      const combined = categoryTotals.map(ct => {
        const category = categories.find(c => c.id === ct.categoryID);
        return {
          categoryId: ct.categoryID,
          name: category?.name || 'Deleted',
          type: category?.type || 'OTHER',
          amount: ct._sum.amount || BigInt(0),
        };
      });
      console.log('categories: ', combined)
      const incomeTotal = combined
        .filter(c => c.type === 'INCOME')
        .reduce((sum, c) => sum + c.amount, BigInt(0));
        
      const expenseTotal = combined
        .filter(c => c.type === 'EXPENSE')
        .reduce((sum, c) => sum + c.amount, BigInt(0));
  
      const withPercentages = combined.map(item => {
        const total = item.type === 'INCOME' ? incomeTotal : expenseTotal;
        const percentage = total !== BigInt(0)
          ? (Number(item.amount) / Number(total)) * 100
          : 0;
  
        return {
          ...item,
          percentage: parseFloat(percentage.toFixed(2)),
          amount: item.amount.toString(),
        };
      }).sort((a, b) => b.percentage - a.percentage);
  
      // Apply pagination
      const startIdx = (page - 1) * limit;
      const paginated = withPercentages.slice(startIdx, startIdx + limit);
  
      return {
        data: paginated,
        pagination: {
          totalItems: withPercentages.length,
          currentPage: page,
          totalPages: Math.ceil(withPercentages.length / limit),
          itemsPerPage: limit
        },
        totals: {
          income: incomeTotal.toString(),
          expense: expenseTotal.toString(),
          net: (incomeTotal - expenseTotal).toString()
        }
      };
    } catch (error) {
      throw new HttpException(`error ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: {
          id: id,
        },
        data: updateCategoryDto
      })
    } catch (error){
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    try {
     return await this.prisma.category.delete({
      where: {
        id: id
      }
     })
    } catch (error){
      throw new HttpException(`error occurred: ${error}`, HttpStatus.BAD_REQUEST)
    }
  }
}
