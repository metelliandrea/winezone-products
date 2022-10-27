import { UpdateProductDto } from 'src/products/dto/updateProduct.dto';

export class UpdateProductCommand {
  constructor(
    public readonly productId: string,
    public readonly product: UpdateProductDto,
  ) {}
}
