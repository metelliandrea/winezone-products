import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { Repository } from 'typeorm';
import { FindAllProductsQuery } from '../impl/findAllProducts.query';

@QueryHandler(FindAllProductsQuery)
export class FindAllProductsHandler
  implements IQueryHandler<FindAllProductsQuery>
{
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  execute(query: FindAllProductsQuery): Promise<Product[]> {
    if (query.withDeleted) {
      return this.productRepository.find({ withDeleted: query.withDeleted });
    }

    return this.productRepository.find();
  }
}
