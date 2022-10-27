import {
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  winery: string;

  @IsString()
  variety: string;

  @IsString()
  @ValidateIf((v) => v.value)
  designation?: string;

  @Min(0)
  @IsNumber()
  price: number;

  @Min(0)
  @Max(100)
  @IsInt()
  rating: number;

  @IsString()
  @ValidateIf((v) => v.value)
  region_1?: string;

  @IsString()
  @ValidateIf((v) => v.value)
  region_2?: string;

  @IsString()
  province: string;

  @IsString()
  country: string;

  @Min(0)
  @Max(50)
  @IsNumber()
  discountPercentage: number;

  @Min(0)
  @IsNumber()
  stock: number;
}
