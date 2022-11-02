import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'E. Guigal 1999  Hermitage',
    description: 'The Product title',
    type: 'string',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example:
      'A massive wine, with its opaque, dense purple color, its huge tannins and its tight, powerful structure. When it develops—maybe in 10 or 15 years time—the perfumed, juicy Syrah fruits that are just suggested for the moment are going to be as dominant as the tannins are now. What a wine it will be then.',
    description: 'The Product description',
    type: 'string',
  })
  description: string;

  @IsString()
  @ApiProperty({
    example: 'E. Guigal',
    description: 'The Winery',
    type: 'string',
  })
  winery: string;

  @IsString()
  @ApiProperty({
    example: 'Rhône-style Red Blend',
    description: 'The Product variety',
    type: 'string',
  })
  variety: string;

  @IsString()
  @ValidateIf((v) => v.value)
  @ApiProperty({
    example: null,
    description: 'The Product designation',
    type: 'string',
    nullable: true,
  })
  designation?: string;

  @Min(0)
  @IsNumber()
  @ApiProperty({
    example: 35.99,
    description: 'The Product price',
    type: 'double',
  })
  price: number;

  @Min(0)
  @Max(100)
  @IsInt()
  @ApiProperty({
    example: 95,
    description: 'The Product rating',
    type: 'int32',
  })
  rating: number;

  @IsString()
  @ValidateIf((v) => v.value)
  @ApiProperty({
    example: 'Hermitage',
    description: 'The Product region_1',
    type: 'string',
    nullable: true,
  })
  region_1?: string;

  @IsString()
  @ValidateIf((v) => v.value)
  @ApiProperty({
    example: null,
    description: 'The Product region_2',
    type: 'string',
    nullable: true,
  })
  region_2?: string;

  @IsString()
  @ApiProperty({
    example: 'Rhône Valley',
    description: 'The Product province',
    type: 'string',
  })
  province: string;

  @IsString()
  @ApiProperty({
    example: 'France',
    description: 'The Product country',
    type: 'string',
  })
  country: string;

  @Min(0)
  @Max(50)
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: "The Product's discount percentage",
    type: 'int32',
  })
  discountPercentage: number;

  @Min(0)
  @IsNumber()
  @ApiProperty({
    example: 83,
    description: 'Quantity in stock',
    type: 'int32',
  })
  stock: number;
}
