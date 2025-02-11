import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createOne(createUserDto: Prisma.UserCreateInput) {
    try {
      const res = await this.prisma.user.create({
        data: createUserDto,
      });
      if (!res) {
        return null;
      }
      return res;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new HttpException(`Error : ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new HttpException(`Error: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        return null;
      }
      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
      if (!updateUser) {
        return null;
      }
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
}
