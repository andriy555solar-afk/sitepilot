export declare const appConfig: () => {
    port: number;
    nodeEnv: string;
};
export declare const dbConfig: () => {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};
export declare const jwtConfig: () => {
    secret: string;
    expiresIn: string;
};
export declare const throttleConfig: () => {
    ttl: number;
    limit: number;
};
