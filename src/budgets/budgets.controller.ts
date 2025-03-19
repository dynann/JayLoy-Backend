import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto, GetBudgetDto,  UpdateBudgetDto } from './dto/create-budget.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/contants';

@ApiTags('Budgets')
@ApiBearerAuth()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get('/get')
  @ApiOperation({ summary: 'get one buget' })
  @ApiResponse({ status: 200, type: GetBudgetDto })
  async findOne(@Request() req: any) {
    return this.budgetsService.findOneBudget(req.user.sub);
  }

  @Patch('/update')
  @ApiOperation({ summary: 'update one budget' })
  @ApiBody({ type: UpdateBudgetDto })
  @ApiResponse({ status: 200, type: UpdateBudgetDto })
  update(@Request() req: any, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.updateOneBudget(req.user.sub, updateBudgetDto);
  }

}