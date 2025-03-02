import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IS_PUBLIC_KEY, Public } from 'src/config/contants';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: Prisma.TransactionCreateInput) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'date', required: false, type: String, example: '2024-02-26' })
  @ApiQuery({ name: 'month', required: false, type: String, example: '2024-02' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  findAll(@Query('date') date?: string, @Query('month') month?: string) {
    let where: any = {}
    console.log(date)
    if(date) {
      where.date = {
        gte: new Date(date + 'T00:00:00.000Z'),
        lte: new Date(date + 'T23:59:59.999Z')
      }
      console.log(where)
    }
    if(month) {
      const startOfMonth = new Date(month + '-01T00:00:00.000Z');
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1, 0);
      where.date = {
        gte: startOfMonth,
        lte: new Date(endOfMonth.getFullYear(), endOfMonth.getMonth(), endOfMonth.getDate() + 1),
      };

     console.log(where)
    }
    return this.transactionsService.findAll(where);
  }
  @Get('/findByAccountId/:id')
  findByAccountId(@Param('id') id: string) {
    return this.transactionsService.findAllByAccountId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Transaction'})
  @ApiBody({ type: UpdateTransactionDto})
  @ApiResponse({ status: 200, type: UpdateTransactionDto })
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
