import { CreateProductDto } from 'src/products/dto/createProduct.dto';

export class CreateProductCommand {
  constructor(public readonly product: CreateProductDto) {}
}
