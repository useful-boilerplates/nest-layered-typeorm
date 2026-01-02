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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig, dbConfig } from './shared/config/db.config';

import path from 'node:path';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [dbConfig.KEY],
      useFactory: (config: DbConfig) => {
        return {
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          autoLoadEntities: true,
          entities: [path.join(__dirname, '/modules/**/*.entity{.ts,.js}')],
          synchronize: process.env.NODE_ENV === 'development',
          logging: process.env.NODE_ENV === 'development',
        };
      },
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
