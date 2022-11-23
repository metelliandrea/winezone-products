import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { FindOneProductQuery } from '../impl/findOneProduct.query';

@QueryHandler(FindOneProductQuery)
export class FindOneProductHandler
  implements IQueryHandler<FindOneProductQuery>
{
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async execute(query: FindOneProductQuery): Promise<Product> {
    if (!query.id) {
      throw new BadRequestException(`No Product id provided`);
    }

    const product = await this.productRepository.findOneBy({ id: query.id });

    if (!product)
      throw new NotFoundException(`No Product found with id #${query.id}`);

    return product;
  }
}
