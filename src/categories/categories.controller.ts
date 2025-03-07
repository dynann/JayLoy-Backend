import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, GetCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, TYPE } from '@prisma/client';
import { ApiProperty, ApiOperation, ApiBody, ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { number } from 'zod';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiProperty({ title: 'create one category', type: CreateCategoryDto })
  @ApiOperation({ summary: 'create one category' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Request() req: any, @Body() createCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoriesService.create(req.user.sub, createCategoryDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'get all categories from database' })
  @ApiResponse({ status: 200, type: [GetCategoryDto]})
  async getAll() {
    return await this.categoriesService.findAll()
  }

  @Get()
  @ApiOperation({ summary: 'get all categories by user id' })
  @ApiResponse({ status: 200, type: [GetCategoryDto]})
  async findAll(@Request() req: any) {
    let where: any = {}
    if(req){
      where.userID = req.user.sub
    }
    return this.categoriesService.findAllByUserID(where);
  }

  
  @Get('summary')
  @ApiOperation({ summary: 'get all categories from database' })
  @ApiQuery({ name: 'page', required: false, type: number, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: number, example: '10' })
  @ApiQuery({ name: 'type', required: true, type: String, enum: TYPE })
  @ApiQuery({ name: 'month', required: false, type: String, example: '2025-10' })
  @ApiResponse({ status: 200, type: [GetCategoryDto]})
  async summaryIncome(
    @Request() req: any,
    @Query('type') type: TYPE,
    @Query('page') page?: number, 
    @Query('limit') limit?: number,
    @Query('month') month?: number) {
    return await this.categoriesService.summaryIncome(req.user.sub, page, limit, type, month)
  }
  
  @Get(':id')
  @ApiOperation({summary: 'get one categories'})
  @ApiResponse({ status: 200, type: GetCategoryDto })
  async findOne(@Request() req: any, @Param('id') id: string) {
    let where: any = {}
    where.userID = req.user.sub 
    where.id = +id
    return this.categoriesService.findOne(+id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'update one category' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: GetCategoryDto })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one category' })
  @ApiResponse({ status: 200, type: GetCategoryDto })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
