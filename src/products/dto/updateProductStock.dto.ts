import { IsNumber, IsString } from 'class-validator';

export class updateProductStockDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsString()
  action: string;
}
