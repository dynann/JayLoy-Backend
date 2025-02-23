import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { AccountsService } from 'src/accounts/accounts.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private accountService: AccountsService) {}
  async createOne(createUserDto: Prisma.UserCreateInput) {
    try {
      const res = await this.prisma.user.findUnique({
        where: {email: createUserDto.email}
      })
      if (res) {
        throw new HttpException('user already exists', HttpStatus.BAD_REQUEST)
      }
      const hashpassword = await bcrypt.hash(createUserDto.password, 10)
      createUserDto.password = hashpassword
      const user = await this.prisma.user.create({data: createUserDto})
      const account = await this.accountService.create(
        {
          name: "default-" + user.id,
          balance: 0,
          Transactions: {
            create: [],
          },
          user: {
            connect: {
              id: user.id,
            }
          },
          currency: {
            connect: {
              id: 1,
            }
          }
        }
      );
      return user
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        deletedAt: true,
        gender: true,
        refreshToken: true,
        password: false,
      },});
      return users;
    } catch (error) {
      throw new HttpException(`Error : ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          role: true,
          createdAt: true,
          deletedAt: true,
          gender: true,
          refreshToken: true,
          password: false,

        },
      });
      if(!user){
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      return user;
    } catch (error) {
      throw new HttpException(`Error: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
      return updateUser;
    } catch (error) {
      throw new HttpException(`Error${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        return null;
      }
      const deleteUser = await this.prisma.user.delete({
        where: { id: id },
      });
      return deleteUser;
    } catch (error) {
      throw new HttpException(`Error ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  
  async updateRefreshToken(id: number, refreshToken: string){
    const user = await this.prisma.user.update({
      where: {id: id},
      data: {refreshToken: refreshToken}
    })
    return "Updated"
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return null;
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        return null
      }
      return user;
    } catch (error) {
      throw new HttpException(
        `an error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
