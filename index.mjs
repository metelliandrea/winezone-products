import { v4 } from 'uuid';
import products from './src/mocks/products.json' assert { type: 'json' };

const x = products.map((item) => ({
  ...item,
  id: v4(),
}));

console.log();
