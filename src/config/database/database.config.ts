import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // return {
    //   name: 'mysql-database',
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   database: 'products',
    //   username: 'root',
    //   password: 'root',
    //   entities: ['dist/**/*.entity.{ts,js}'],
    //   logging: ['query', 'error'],
    //   synchronize: true,
    //   // synchronize: false,
    // };
    return {
      name: 'mysql-database',
      type: 'mysql',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      logging: ['query', 'error'],
      synchronize: this.config.get<string>('NODE_ENV') !== 'production',
      // synchronize: false,
    };
  }
}
