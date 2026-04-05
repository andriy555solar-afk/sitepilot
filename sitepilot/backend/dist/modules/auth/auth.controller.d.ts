import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(body: any): Promise<{
        message: string;
        user: import("../users/user.entity").User;
    }>;
    login(body: any): Promise<{
        access_token: string;
    }>;
}
