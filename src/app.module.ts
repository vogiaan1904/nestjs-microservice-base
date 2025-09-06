import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared.module';
import { AppConfigService } from '@services/config.service';
import { JwtModule } from '@nestjs/jwt';
import { MicroserviceModule } from '@infra/microservices/microservice.module';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { TransformInterceptor } from '@interceptors/transfrom.interceptor';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { InternalServiceJwtGuard } from '@guards/internal-service-jwt.guard';
import { InternalUserJwtGuard } from '@guards/internal-user-jwt.guard';
import { LoggerMiddleware } from '@middlewares/logging.middleware';

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      useFactory: async (configService: AppConfigService) => {
        return {
          secret: configService.microservicesConfig.internalKey,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [AppConfigService],
    }),
    MicroserviceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => {
        return new ClassSerializerInterceptor(reflector, {
          enableImplicitConversion: false,
          excludeExtraneousValues: true,
        });
      },
      inject: [Reflector],
    },
    InternalServiceJwtGuard,
    InternalUserJwtGuard,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
