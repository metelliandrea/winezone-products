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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { hostname } from 'os';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/impl/createProduct.command';
import { FindOneProductQuery } from './queries/impl/findOneProduct.query';
import { FindAllProductsQuery } from './queries/impl/findAllProducts.query';
import { UpdateProductCommand } from './commands/impl/updateProduct.command';
import { DeleteProductCommand } from './commands/impl/deleteProduct.command';
import { SearchProductsQuery } from './queries/impl/searchProducts.query';
import { NextFunction } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { updateProductStockDto } from './dto/updateProductStock.dto';
import { ProductsService } from './products.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entity/product.entity';
import { MessagePatternExceptionFilter } from 'src/filters/rpcException.filter';
import { CheckUserRoles } from 'src/guards/role.guard';
import { RequiredRoles, Roles } from 'src/decorators/role.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(CheckUserRoles)
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
  @Header('X-Reply-From', hostname())
  @RequiredRoles(Roles.ADMIN)
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @Patch(':id')
  @HttpCode(204)
  @Header('X-Reply-From', hostname())
  @RequiredRoles(Roles.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, updateProductDto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @Header('X-Reply-From', hostname())
  @RequiredRoles(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }

  @MessagePattern('update_stock')
  @UseFilters(new MessagePatternExceptionFilter())
  decreaseStock(@Payload() payload: updateProductStockDto) {
    return this.productsService.decreaseStock(payload);
  }

  @MessagePattern('products_details')
  @UseFilters(new MessagePatternExceptionFilter())
  getProductDetails(@Payload() payload: { products: string | string[] }) {
    return this.productsService.getProductDetails(payload);
  }

  /**
   * QUERIES
   */

  @Get()
  @Header('X-Reply-From', hostname())
  @RequiredRoles(Roles.ADMIN, Roles.PREMIUM, Roles.STANDARD)
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
  @RequiredRoles(Roles.ADMIN, Roles.PREMIUM, Roles.STANDARD)
  findOne(@Param('id') id: string, @Next() next: NextFunction) {
    if (id !== 'search')
      return this.queryBus.execute(new FindOneProductQuery(id));

    return next();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({
    status: 201,
    description:
      'Search products by Title, Descriptions, using a search keyword',
    type: Product,
  })
  @Header('X-Reply-From', hostname())
  @RequiredRoles(Roles.ADMIN, Roles.PREMIUM, Roles.STANDARD)
  search(@Query('q') q: string) {
    return this.queryBus.execute(new SearchProductsQuery(q));
  }
}
