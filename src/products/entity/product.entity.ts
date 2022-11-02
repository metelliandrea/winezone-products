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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'varchar', length: 500, default: null })
  description: string;

  @Column({ type: 'varchar', length: 50, default: null })
  winery: string;

  @Column({ type: 'varchar', length: 50, default: null })
  variety: string;

  @Column({ type: 'varchar', length: 50, default: null })
  designation?: string;

  @Column({ type: 'decimal', precision: 9, scale: 3 })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  price: number;

  @Column({ type: 'integer', default: 0 })
  discountPercentage: number;

  @Column({ type: 'integer', default: null })
  rating: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'varchar', length: 50, default: null })
  region_1?: string;

  @Column({ type: 'varchar', length: 50, default: null })
  region_2?: string;

  @Column({ type: 'varchar', length: 50, default: null })
  province: string;

  @Column({ type: 'varchar', length: 50, default: null })
  country: string;

  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date; // CURRENT_TIMESTAMP

  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date; // CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

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
