import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto, GetCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ApiProperty, ApiOperation, ApiBody, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Currencies')
@ApiBearerAuth()
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiProperty({ title: 'create one currency', type: CreateCurrencyDto })
  @ApiOperation({ summary: 'create one currency' })
  @ApiBody({ type: CreateCurrencyDto })
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all currencies' })
  @ApiResponse({ status: 200, type: [GetCurrencyDto]})
  async findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get on currency' })
  @ApiResponse({ status: 200, type: GetCurrencyDto })
  async findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update currency' })
  @ApiResponse({ status: 200, type: GetCurrencyDto })
  async update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currenciesService.update(+id, updateCurrencyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete curreny' })
  @ApiResponse({ status: 200, type: GetCurrencyDto })
  async remove(@Param('id') id: string) {
    return this.currenciesService.remove(+id);
  }
}
