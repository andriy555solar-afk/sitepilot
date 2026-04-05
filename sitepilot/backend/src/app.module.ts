import { Module, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { appConfig, dbConfig, jwtConfig, throttleConfig } from './config/configuration';
import { GlobalExceptionFilter } from './modules/common/filters/http-exception.filter';

import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';

import { User } from './modules/users/user.entity';
import { Project } from './modules/projects/project.entity';
import { ProjectMember } from './modules/projects/project-member.entity';

@Module({
  imports: [
    BillingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig, throttleConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('databaseUrl');

        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            ssl: { rejectUnauthorized: false },
            entities: [User, Project, ProjectMember],
            synchronize: false,
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('dbHost'),
          port: config.get<number>('dbPort'),
          username: config.get<string>('dbUsername'),
          password: config.get<string>('dbPassword'),
          database: config.get<string>('dbName'),
          entities: [User, Project, ProjectMember],
          synchronize: false,
        };
      },
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('throttleTtl') || 60,
            limit: config.get<number>('throttleLimit') || 10,
          },
        ],
      }),
    }),

    AuthModule,
    ProjectsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
