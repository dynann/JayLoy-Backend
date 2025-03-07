import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto, GetBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/contants';

@ApiTags('Budgets')
@ApiBearerAuth()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'create one budget' })
  @ApiBody({ type: CreateBudgetDto })
  @ApiResponse({ status: 200, type: GetBudgetDto })
  async create(@Request() req:any, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.createBudget(req.user.sub, createBudgetDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'get all budgets' })
  @ApiResponse({ status: 200, type: [GetBudgetDto] })
  @ApiQuery({ name: 'userID', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2025-03-07T00:00:00.000Z' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2025-03-07T23:59:59.000Z' })
  async findAll(@Query('userID') userID: number,
                @Query('startDate') startDate: string,
                @Query('endDate') endDate: string) {
              
    const where: any = {}
    if(userID){
      where.userID = +userID
    }
    if(startDate){
      where.startDate = { gte: startDate }
    }
    if(endDate){
      where.endDate = { lte: endDate }
    }
    return this.budgetsService.findAllBudget({
      where: where
    });
  }

  @Get('/mine')
  @ApiOperation({ summary: 'get all my budget' })
  @ApiResponse({ status: 200, type: [GetBudgetDto] })
  async getAllMyBudget(@Request() req: any) {
    return this.budgetsService.findAllBudget(req.user.sub)
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one buget' })
  @ApiResponse({ status: 200, type: GetBudgetDto })
  async findOne(@Request() req: any ,@Param('id') id: string) {
    return this.budgetsService.findOneBudget(req.user.sub, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one budget' })
  @ApiBody({ type: UpdateBudgetDto })
  @ApiResponse({ status: 200, type: GetBudgetDto })
  update(@Request() req: any, @Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.updateOneBudget(req.user.sub ,+id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one budget' })
  @ApiResponse({ status: 200, type: GetBudgetDto })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.budgetsService.removeOneBudget(req.user.sub, +id);
  }
}
