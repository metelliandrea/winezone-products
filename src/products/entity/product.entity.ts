import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'products' })
export class Product implements IProduct {
  @ApiProperty({
    example: '02f1d3af-d935-4e55-813d-c97ab03d2e59',
    description: 'The Product identifier',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'E. Guigal 1999  Hermitage',
    description: 'The Product title',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @ApiProperty({
    example:
      'A massive wine, with its opaque, dense purple color, its huge tannins and its tight, powerful structure. When it develops—maybe in 10 or 15 years time—the perfumed, juicy Syrah fruits that are just suggested for the moment are going to be as dominant as the tannins are now. What a wine it will be then.',
    description: 'The Product description',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 500, default: null })
  description: string;

  @ApiProperty({
    example: 'E. Guigal',
    description: 'The Winery',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 50, default: null })
  winery: string;

  @ApiProperty({
    example: 'Rhône-style Red Blend',
    description: 'The Product variety',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 50, default: null })
  variety: string;

  @ApiProperty({
    example: null,
    description: 'The Product designation',
    type: 'string',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, default: null })
  designation?: string;

  @ApiProperty({
    example: 35.99,
    description: 'The Product price',
    type: 'double',
  })
  @Column({ type: 'decimal', precision: 9, scale: 3 })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  price: number;

  @ApiProperty({
    example: 2,
    description: "The Product's discount percentage",
    type: 'int32',
  })
  @Column({ type: 'integer', default: 0 })
  discountPercentage: number;

  @ApiProperty({
    example: 95,
    description: 'The Product rating',
    type: 'int32',
  })
  @Column({ type: 'integer', default: null })
  rating: number;

  @ApiProperty({
    example: 83,
    description: 'Quantity in stock',
    type: 'int32',
  })
  @Column({ type: 'integer' })
  stock: number;

  @ApiProperty({
    example: 'Hermitage',
    description: 'The Product region_1',
    type: 'string',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, default: null })
  region_1?: string;

  @ApiProperty({
    example: null,
    description: 'The Product region_2',
    type: 'string',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, default: null })
  region_2?: string;

  @ApiProperty({
    example: 'Rhône Valley',
    description: 'The Product province',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 50, default: null })
  province: string;

  @ApiProperty({
    example: 'France',
    description: 'The Product country',
    type: 'string',
  })
  @Column({ type: 'varchar', length: 50, default: null })
  country: string;

  @ApiProperty({
    example: '24/10/2022, 20:47:22',
    description: 'Creation date',
    type: 'Date',
  })
  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date; // CURRENT_TIMESTAMP

  @ApiProperty({
    example: '24/10/2022, 20:47:22',
    description: 'Update date',
    type: 'Date',
  })
  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date; // CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

  @ApiProperty({
    example: null,
    description: 'Deletion date',
    type: 'Date',
    nullable: true,
  })
  @Transform(({ value }) =>
    value ? new Date(value).toLocaleString('us') : null,
  )
  @DeleteDateColumn({ type: 'datetime', default: null })
  deletedAt!: Date;
}

interface IProduct {
  id: string;
  title: string;
  description: string;
  winery: string;
  variety: string;
  designation?: string;
  price: number;
  rating: number;
  region_1?: string;
  region_2?: string;
  province: string;
  country: string;
  discountPercentage: number;
  stock: number;
}
