import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductCommand } from '../impl/createProduct.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async execute(command: CreateProductCommand): Promise<string> {
    const newProduct = await this.productRepository.create(command.product);

    /**
     * If you want to return the whole object to the client, uncomment this line
     * and comment the two lines below.
     */
    // return this.productRepository.save(newProduct);
    const saved = await this.productRepository.save(newProduct);
    return saved.id;
  }
}
