import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, GetAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Prisma } from '@prisma/client';
import { CreateTransactionDto, GetTransactionDto } from 'src/transactions/dto/create-transaction.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'create one account'})
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 200, type: GetAccountDto })
  async create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all accounts'})
  @ApiResponse({ status: 200, type: [GetAccountDto] })
  async findAll() {
    return this.accountsService.findAll();
  }
  @Post('/insert')
  @ApiOperation({ summary: 'insert account transaction'})
  @ApiResponse({ status: 200, type: CreateTransactionDto})
  async insertTransaction(@Request() req, @Body() createTransactionDTO: CreateTransactionDto ) {
    return await this.accountsService.insertTransaction(req.user.sub, createTransactionDTO);
  }

  @Get('/transaction')
  @ApiOperation({ summary: 'get account transaction'})
  @ApiResponse({ status: 200, type: [GetTransactionDto]})
  async findAllTransaction(@Request() req) {
    return this.accountsService.findAllAccountTransaction(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one account'})
  @ApiResponse({ status: 200, type: GetAccountDto})
  async findOne(@Param('id') id: string) {
    return this.accountsService.findByUserId(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one account'})
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({ status: 200, type: GetAccountDto})
  async update(@Param('id') id: string, @Body() updateAccountDto: Prisma.AccountUpdateInput) {
    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete account' })
  @ApiResponse({ status: 200, type: GetAccountDto })
  async remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }

}
