import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { AccountsService } from 'src/accounts/accounts.service';
import { BudgetsService } from 'src/budgets/budgets.service';
import { connect } from 'http2';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private accountService: AccountsService, private budgetService: BudgetsService) { }
  async createOne(createUserDto: Prisma.UserCreateInput) {
    try {
      if (this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
        select: {
          id: true,
          email: true,
          role: true,
        }
      })) {

      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createUserDto.email)) {
        throw new BadRequestException('invalid email')
      }
      if (createUserDto.password) {
        if (createUserDto.password.length < 8) {
          throw new BadRequestException('password must be at least 8 characters')
        }
        const hashpassword = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.password = hashpassword
      }

      const res = await this.prisma.user.findUnique({
        where: { email: createUserDto.email }
      })
      if (createUserDto.username) {
        createUserDto.username = createUserDto.username.replace(/\s/g, "")
        // console.log(createUserDto.username)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(createUserDto.username)) {
          throw new HttpException('Username can only contain letters, numbers, underscores, and hyphens', HttpStatus.BAD_REQUEST);
        }
      }
      if (res) {
        throw new HttpException('user already exists', HttpStatus.BAD_REQUEST)
      }

      const user = await this.prisma.user.create({ data: createUserDto })
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
      const budget = await this.budgetService.createBudget(user.id, {
        amount: 0,
      })
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
        },
      });
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
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      return user;
    } catch (error) {
      throw new HttpException(`Error: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      if (updateUserDto.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateUserDto.email.toString())) {
          throw new BadRequestException('invalid email')
        }
      }
      if (updateUserDto.password) {
        if (updateUserDto.password.toString.length < 8) {
          throw new BadRequestException('password must be at least 8 characters')
        }
      }
      if (updateUserDto.username) {
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(updateUserDto.username.toString())) {
          throw new HttpException('Username can only contain letters, numbers, underscores, and hyphens', HttpStatus.BAD_REQUEST);
        }
      }
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
      return "Successfully Deleted!";
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

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { refreshToken: refreshToken }
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
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return null
        }
      }

      return user;
    } catch (error) {
      throw new HttpException(
        `an error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePassword(id: number, password: string, oldPassword: string) {
    try {

      if (password.length < 8 || oldPassword.length < 8) {
        throw new HttpException('password must be at least 8 characters', HttpStatus.BAD_REQUEST)
      }
      const userOldPassword = await this.prisma.user.findUnique({
        where: { id: id },
        select: { password: true }
      })
      if (!userOldPassword) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND)
      }
      const isMatch = await bcrypt.compare(oldPassword, userOldPassword.password)
      if (!isMatch) {
        throw new HttpException('old password is incorrect', HttpStatus.BAD_REQUEST)
      }
      if (password === oldPassword) {
        throw new HttpException('new password cannot be the same as the old password', HttpStatus.BAD_REQUEST)
      }
      const hashpassword = await bcrypt.hash(password, 10)
      const user = await this.prisma.user.update({
        where: { id: id },
        data: { password: hashpassword }
      })
      return "successfully updated password"
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }

  }

  async removeRefreshToken(userID: number) {
    const user = await this.prisma.user.update({
      where: { id: userID },
      data: { refreshToken: null }
    })
  }
}