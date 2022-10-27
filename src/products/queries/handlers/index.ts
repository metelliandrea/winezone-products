import { FindAllProductsHandler } from './findAllProducts.handler';
import { FindOneProductHandler } from './findOneProduct.handler';
import { SearchProductsHandler } from './searchProducts.handler';

class Queries {
  private queries;

  constructor(queries) {
    this.queries = queries;
  }

  getQueries() {
    return this.queries;
  }
}

export const ProductsQueries = new Queries([
  FindAllProductsHandler,
  FindOneProductHandler,
  SearchProductsHandler,
]);
