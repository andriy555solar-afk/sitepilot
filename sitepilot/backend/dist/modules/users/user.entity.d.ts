export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    status: UserStatus;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    emailVerifyToken?: string;
    emailVerifyExpires?: Date;
    lastLoginIp?: string;
    createdAt: Date;
    updatedAt: Date;
}
