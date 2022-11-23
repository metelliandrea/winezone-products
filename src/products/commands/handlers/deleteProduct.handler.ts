import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { Repository } from 'typeorm';
import { DeleteProductCommand } from '../impl/deleteProduct.command';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.productRepository.findOneBy({
      id: command.productId,
    });

    if (!product)
      throw new NotFoundException(
        `No Product found with id #${command.productId}`,
      );

    await this.productRepository.softDelete(command.productId);
  }
}
