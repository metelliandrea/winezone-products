import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            protocol: 'amqp',
            hostname: config.get<string>('RABBITMQ_HOSTNAME') || 'localhost',
            port: config.get<number>('RABBITMQ_PORT') || 5672,
            username: config.get<string>('RABBITMQ_USERNAME') || 'root',
            password: config.get<string>('RABBITMQ_PASSWORD') || 'root',
            vhost: '/products',
          },
        ],
        prefetchCount: 1,
        queue: config.get<string>('RABBITMQ_QUEUE') || 'stock_queue',
        queueOptions: { durable: true },
      },
    },
    { inheritAppConfig: true },
  );

  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
