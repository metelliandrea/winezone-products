import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { SearchProductsQuery } from '../implementations/searchProducts.query';

@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler
  implements IQueryHandler<SearchProductsQuery>
{
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async execute(query: SearchProductsQuery): Promise<Product | Product[] | []> {
    if (!query.q) {
      throw new BadRequestException(`No query provided`);
    }

    return this.productRepository.find({
      where: [
        { title: Like(`%${query.q}%`) },
        { description: Like(`%${query.q}%`) },
        { variety: Like(`%${query.q}%`) },
      ],
    });
  }
}
