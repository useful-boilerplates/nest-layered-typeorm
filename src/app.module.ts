import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './shared/config/app.config';
import { LoggerModule } from './shared/logger';
import { RequestIdMiddleware } from './shared/middlewares/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
