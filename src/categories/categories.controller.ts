import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, GetCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { ApiProperty, ApiOperation, ApiBody, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({ status: 200, type: [GetCategoryDto]})
  async summary(@Request() req: any) {
    return await this.categoriesService.summary(req.user.sub)
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
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
