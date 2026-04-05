"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttleConfig = exports.jwtConfig = exports.dbConfig = exports.appConfig = void 0;
const appConfig = () => ({
    port: 3000,
    nodeEnv: 'development',
});
exports.appConfig = appConfig;
const dbConfig = () => ({
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'sitepilot',
});
exports.dbConfig = dbConfig;
const jwtConfig = () => ({
    secret: 'supersecret',
    expiresIn: '7d',
});
exports.jwtConfig = jwtConfig;
const throttleConfig = () => ({
    ttl: 60,
    limit: 10,
});
exports.throttleConfig = throttleConfig;
//# sourceMappingURL=configuration.js.map