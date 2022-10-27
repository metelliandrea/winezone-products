import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Next,
  Header,
} from '@nestjs/common';
import { hostname } from 'os';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/implementations/createProduct.command';
import { FindOneProductQuery } from './queries/implementations/findOneProduct.query';
import { FindAllProductsQuery } from './queries/implementations/findAllProducts.query';
import { UpdateProductCommand } from './commands/implementations/updateProduct.command';
import { DeleteProductCommand } from './commands/implementations/deleteProduct.command';
import { SearchProductsQuery } from './queries/implementations/searchProducts.query';
import { NextFunction } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DecreaseStockDto } from './dto/decreaseProductStock.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * COMMANDS
   */

  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, updateProductDto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }

  @MessagePattern('decrease-stock')
  decreaseStock(@Payload() payload: DecreaseStockDto) {
    return this.productsService.decreaseStock(payload);
  }

  @MessagePattern('products-details')
  getProductDetails(@Payload() payload: GetProductDetailsDto) {
    return this.productsService.getProductDetails(payload);
  }

  /**
   * QUERIES
   */

  @Get()
  @Header('X-Reply-From', hostname())
  findAll(@Query('withDeleted') withDeleted?: boolean) {
    return this.queryBus.execute(new FindAllProductsQuery(withDeleted));
  }

  @Get(':id')
  @Header('X-Reply-From', hostname())
  findOne(@Param('id') id: string, @Next() next: NextFunction) {
    if (id !== 'search')
      return this.queryBus.execute(new FindOneProductQuery(id));

    return next();
  }

  @Get('search')
  @Header('X-Reply-From', hostname())
  search(@Query('q') q: string) {
    return this.queryBus.execute(new SearchProductsQuery(q));
  }
}
