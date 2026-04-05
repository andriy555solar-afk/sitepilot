export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BANNED = "BANNED"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    avatarUrl: string;
    status: UserStatus;
    emailVerified: boolean;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    emailVerifyToken: string;
    emailVerifyExpires: Date;
    lastLoginAt: Date;
    createdAt: Date;
}
