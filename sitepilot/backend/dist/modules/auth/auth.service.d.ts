import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class AuthService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    register(email: string, password: string): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    updateLoginIp(userId: string, ip: string): Promise<void>;
    setResetToken(userId: string, token: string, expires: Date): Promise<void>;
    clearResetToken(userId: string): Promise<void>;
    setEmailVerifyToken(userId: string, token: string, expires: Date): Promise<void>;
    verifyEmail(userId: string): Promise<void>;
}
