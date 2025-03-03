import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(userID: number, createCategoryDto: Prisma.CategoryCreateInput) {
    console.log(createCategoryDto, userID)
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

  async summary(userID: number){
    try {
      const categoryTotals = await this.prisma.transaction.groupBy({
        by: ['categoryID'],
        where: {
          account: {
            userID: userID
          }
        },
        _sum: {
          amount: true
        },
        orderBy: {
          _sum: {
            amount: 'desc'
          }
        }
      });
      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: categoryTotals.map(ct => ct.categoryID) }
        }
      });
      const total = categoryTotals.reduce(
        (sum, ct) => sum + (ct._sum.amount || BigInt(0)),
        BigInt(0)
      );
      return categoryTotals.map(ct => {
        const category = categories.find(c => c.id === ct.categoryID);
        const percentage = total !== BigInt(0)
          ? (Number(ct._sum.amount) / Number(total)) * 100
          : 0;
  
        return {
          name: category.name,
          type: category.type,
          amount: ct._sum.amount?.toString(),
          percentage: parseFloat(percentage.toFixed(2)),
          currency: 'USD'
        };
      });
    } catch (error) {
      throw new HttpException(`error ${error}`, HttpStatus.BAD_REQUEST)
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
