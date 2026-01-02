import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './shared/logger';
import { setupCors } from './shared/bootstrap/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);

  app.useLogger(logger);

  setupCors(app, logger);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
