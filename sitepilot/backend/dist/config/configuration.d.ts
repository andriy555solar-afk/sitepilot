export declare const appConfig: () => {
    appPort: number;
    nodeEnv: string;
};
export declare const dbConfig: () => {
    databaseUrl: string;
    dbHost: string;
    dbPort: number;
    dbUsername: string;
    dbPassword: string;
    dbName: string;
};
export declare const jwtConfig: () => {
    jwtSecret: string;
    jwtExpiresIn: string;
};
export declare const throttleConfig: () => {
    throttleTtl: number;
    throttleLimit: number;
};
