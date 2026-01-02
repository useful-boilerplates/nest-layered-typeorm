import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './shared/config/app.config';
import { LoggerModule } from './shared/logger';
import { RequestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  ThrottlerConfig,
  throttlerConfig,
} from './shared/config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(throttlerConfig)],
      inject: [throttlerConfig.KEY],
      useFactory: (config: ThrottlerConfig) => [
        {
          ttl: config.ttl,
          limit: config.limit,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
