"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const configuration_1 = require("./config/configuration");
const http_exception_filter_1 = require("./modules/common/filters/http-exception.filter");
const auth_module_1 = require("./modules/auth/auth.module");
const projects_module_1 = require("./modules/projects/projects.module");
const user_entity_1 = require("./modules/users/user.entity");
const project_entity_1 = require("./modules/projects/project.entity");
const project_member_entity_1 = require("./modules/projects/project-member.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            BillingModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.appConfig, configuration_1.dbConfig, configuration_1.jwtConfig, configuration_1.throttleConfig],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const dbUrl = config.get('databaseUrl');
                    if (dbUrl) {
                        return {
                            type: 'postgres',
                            url: dbUrl,
                            ssl: { rejectUnauthorized: false },
                            entities: [user_entity_1.User, project_entity_1.Project, project_member_entity_1.ProjectMember],
                            synchronize: false,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: config.get('dbHost'),
                        port: config.get('dbPort'),
                        username: config.get('dbUsername'),
                        password: config.get('dbPassword'),
                        database: config.get('dbName'),
                        entities: [user_entity_1.User, project_entity_1.Project, project_member_entity_1.ProjectMember],
                        synchronize: false,
                    };
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [
                        {
                            ttl: config.get('throttleTtl') || 60,
                            limit: config.get('throttleLimit') || 10,
                        },
                    ],
                }),
            }),
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({ whitelist: true, transform: true }),
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.ClassSerializerInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.GlobalExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map