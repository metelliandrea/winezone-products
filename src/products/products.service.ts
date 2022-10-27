import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DecreaseStockDto } from './dto/decreaseProductStock.dto';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductsService {
  @InjectRepository(Product) productRepository: Repository<Product>;

  async decreaseStock(payload: DecreaseStockDto): Promise<any> {
    const product = await this.productRepository.findOneBy({
      id: payload.productId,
    });

    if (!product) {
      throw new RpcException(
        "Cannot update product's stock. Product not found",
      );
    }

    await this.productRepository.update(payload.productId, {
      stock: product.stock - payload.quantity,
    });

    return {};
  }

  async getProductDetails(payload: GetProductDetailsDto) {}
}
