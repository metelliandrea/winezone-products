import { CreateProductHandler } from './createProduct.handler';
import { DeleteProductHandler } from './deleteProduct.handler';
import { UpdateProductHandler } from './updateProduct.handler';

class Commands {
  private commands;

  constructor(commands) {
    this.commands = commands;
  }

  getCommands() {
    return this.commands;
  }
}

export const ProductCommands = new Commands([
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
]);
