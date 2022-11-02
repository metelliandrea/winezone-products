import { IsNumber, IsString, Min } from 'class-validator';

export class ProductDetailsDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(0)
  @IsNumber()
  price: number;
}
