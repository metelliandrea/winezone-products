import * as _ from 'lodash';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductCommand } from '../impl/updateProduct.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const product = await this.productRepository.findOneBy({
      id: command.productId,
    });

    if (!product)
      throw new NotFoundException(
        `No Product found with id #${command.productId}`,
      );

    await this.productRepository.save(_.merge(product, command.product));
  }
}
