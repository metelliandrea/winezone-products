import { IsNumber, IsString } from 'class-validator';

export class DecreaseStockDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
