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
  BadRequestException,
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
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entity/product.entity';

@Controller('products')
@ApiTags('Products')
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
  @HttpCode(204)
  @ApiOkResponse({ status: 204 })
  @ApiBadRequestResponse({ type: BadRequestException })
  // @ApiResponse({ status: 201, description: 'Created' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'BadRequest',
  //   type: BadRequestException,
  // })
  // @ApiResponse({ status: 404, description: 'NotFound' })
  // @ApiResponse({ status: 500, description: 'InternalServerError' })
  @Header('X-Reply-From', hostname())
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @Patch(':id')
  @HttpCode(204)
  @Header('X-Reply-From', hostname())
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, updateProductDto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @Header('X-Reply-From', hostname())
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }

  @MessagePattern('decrease-stock')
  decreaseStock(@Payload() payload: DecreaseStockDto) {
    return this.productsService.decreaseStock(payload);
  }

  @MessagePattern('products-details')
  getProductDetails(@Payload() payload: { products: string | string[] }) {
    return this.productsService.getProductDetails(payload);
  }

  /**
   * QUERIES
   */

  @Get()
  @ApiOkResponse({
    status: 201,
    description: 'Retrieve all products in database',
    type: Product,
    isArray: true,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'BadRequest',
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'InternalServerError',
  })
  @Header('X-Reply-From', hostname())
  findAll(@Query('withDeleted') withDeleted?: boolean) {
    return this.queryBus.execute(new FindAllProductsQuery(withDeleted));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product' })
  @ApiResponse({
    status: 201,
    description: 'Retrieve single product by ProductId',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    type: BadRequestException,
  })
  @ApiResponse({ status: 404, description: 'NotFound' })
  @ApiResponse({ status: 500, description: 'InternalServerError' })
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
