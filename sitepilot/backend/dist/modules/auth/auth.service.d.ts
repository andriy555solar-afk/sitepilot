import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, AuthResponseDto, AuthTokensDto } from './auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly config;
    private readonly logger;
    constructor(userRepo: Repository<User>, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto, ip?: string): Promise<AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<AuthTokensDto>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private toAuthUser;
}
