import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { updateProductStockDto } from './dto/updateProductStock.dto';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductsService {
  @InjectRepository(Product) productRepository: Repository<Product>;

  constructor(private readonly config: ConfigService) {}

  async decreaseStock(payload: updateProductStockDto): Promise<any> {
    const product = await this.productRepository.findOneBy({
      id: payload.productId,
    });

    if (!product) {
      throw new RpcException({
        message: "Cannot update product's stock. Product not found",
      });
    }

    await this.productRepository.update(payload.productId, {
      stock:
        payload.action ===
        this.config.get<string>('ADD_PRODUCTS_TO_STOCK_SYMBOL')
          ? product.stock + payload.quantity
          : product.stock - payload.quantity,
    });

    return {};
  }

  async getProductDetails(payload: { products: string | string[] }) {
    if (Array.isArray(payload.products)) {
      return this.productRepository.find({
        where: { id: In(payload.products) },
      });
    } else
      throw new RpcException({
        message: 'Please provide a list of products identifiers',
      });
  }
}
