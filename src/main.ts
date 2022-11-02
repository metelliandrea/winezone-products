import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  // Swagger
  const swaggerOptions: SwaggerDocumentOptions = {};
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Winezone-products')
    .setDescription("Winezone! Product's microservice API")
    .setVersion('1.0')
    .addTag('Products')
    .setLicense('MIT', '')
    .setContact('Andrea Metelli', null, 'metelliandrea@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api', app, document);

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
