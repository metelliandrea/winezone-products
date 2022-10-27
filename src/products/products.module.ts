import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductsQueries } from './queries/handlers';
import { ProductCommands } from './commands/handlers';
import { ProductsService } from './products.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [].concat(
    ProductsService,
    ProductCommands.getCommands(),
    ProductsQueries.getQueries(),
  ),
})
export class ProductsModule {}
