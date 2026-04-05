import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      status: UserStatus.PENDING_VERIFICATION,
    });

    return this.usersRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async updateLoginIp(userId: string, ip: string) {
    await this.usersRepository.update(userId, {
      lastLoginIp: ip,
    });
  }

  async setResetToken(userId: string, token: string, expires: Date) {
    await this.usersRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  async clearResetToken(userId: string) {
    await this.usersRepository.update(userId, {
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  async setEmailVerifyToken(userId: string, token: string, expires: Date) {
    await this.usersRepository.update(userId, {
      emailVerifyToken: token,
      emailVerifyExpires: expires,
    });
  }

  async verifyEmail(userId: string) {
    await this.usersRepository.update(userId, {
      emailVerifyToken: undefined,
      emailVerifyExpires: undefined,
      status: UserStatus.ACTIVE,
    });
  }
}
