import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { LoremIpsum } from 'lorem-ipsum';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  getHello(): string {
    return 'Hello World!';
  }

  throwError(req: Request): InternalServerErrorException {
    const randomText = this.lorem.generateSentences();
    const error = new InternalServerErrorException(randomText);
    this.logger.error(
      {
        ipAddress: req.socket.remoteAddress,
        //userId: req.userId,
        function: 'throwError',
      },
      randomText,
      error.stack,
    );

    throw error;
  }
}
