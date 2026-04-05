"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('app.port') ?? 3001;
    const apiPrefix = config.get('app.apiPrefix') ?? 'api/v1';
    const env = config.get('app.nodeEnv');
    const corsOrigins = config.get('app.corsOrigins') ?? [];
    const logger = new common_1.Logger('Bootstrap');
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    if (env !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('SitePilot API')
            .setDescription('Керуюча платформа для solomiya-energy.com')
            .setVersion('1.0.0')
            .addBearerAuth()
            .addServer(`http://localhost:${port}`, 'Local')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        logger.log(`Swagger: http://localhost:${port}/docs`);
    }
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString(), env });
    });
    await app.listen(port);
    logger.log(`🚀 SitePilot API running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map