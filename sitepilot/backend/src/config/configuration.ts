export const appConfig = () => ({
  appPort: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
});

export const dbConfig = () => ({
  databaseUrl: process.env.DATABASE_URL || '',

  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUsername: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASS || '',
  dbName: process.env.DB_NAME || 'sitepilot',
});

export const jwtConfig = () => ({
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

export const throttleConfig = () => ({
  throttleTtl: parseInt(process.env.THROTTLE_TTL || '60', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
});