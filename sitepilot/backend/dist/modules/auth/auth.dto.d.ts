export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthTokensDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class AuthUserDto {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
}
export declare class AuthResponseDto {
    user: AuthUserDto;
    tokens: AuthTokensDto;
}
