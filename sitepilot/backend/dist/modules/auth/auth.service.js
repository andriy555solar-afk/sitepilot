"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepo, jwtService, config) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.config = config;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email },
            withDeleted: true,
        });
        if (existing) {
            throw new common_1.ConflictException('Користувач з таким email вже існує');
        }
        const rounds = this.config.get('app.bcryptRounds') ?? 12;
        const passwordHash = await bcrypt.hash(dto.password, rounds);
        const verifyToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = this.userRepo.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            status: user_entity_1.UserStatus.PENDING_VERIFICATION,
            emailVerified: false,
            emailVerifyToken: verifyToken,
            emailVerifyExpires: verifyExpires,
        });
        await this.userRepo.save(user);
        this.logger.log(`User registered: ${user.email}`);
        const tokens = await this.generateTokens(user);
        return { user: this.toAuthUser(user), tokens };
    }
    async login(dto, ip) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (!user) {
            await bcrypt.compare(dto.password, '$2b$12$invalidhashfortimingsafety000000000');
            throw new common_1.UnauthorizedException('Невірний email або пароль');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Невірний email або пароль');
        }
        if (user.status === user_entity_1.UserStatus.BANNED) {
            throw new common_1.UnauthorizedException('Акаунт заблокований');
        }
        if (user.status === user_entity_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException('Акаунт деактивований');
        }
        await this.userRepo.update(user.id, {
            lastLoginAt: new Date(),
            lastLoginIp: ip ?? null,
        });
        this.logger.log(`User logged in: ${user.email}`);
        const tokens = await this.generateTokens(user);
        return { user: this.toAuthUser(user), tokens };
    }
    async refresh(dto) {
        let payload;
        try {
            payload = this.jwtService.verify(dto.refreshToken, {
                secret: this.config.get('jwt.refreshSecret'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Невалідний refresh token');
        }
        const user = await this.userRepo.findOne({ where: { id: payload.sub } });
        if (!user || user.status === user_entity_1.UserStatus.BANNED) {
            throw new common_1.UnauthorizedException('Користувача не знайдено або заблокований');
        }
        return this.generateTokens(user);
    }
    async forgotPassword(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            return { message: 'Якщо email існує — ми надіслали інструкції' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.userRepo.update(user.id, {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        });
        this.logger.log(`Password reset requested for: ${user.email}`);
        return { message: 'Якщо email існує — ми надіслали інструкції' };
    }
    async resetPassword(dto) {
        const user = await this.userRepo.findOne({
            where: { resetPasswordToken: dto.token },
        });
        if (!user || !user.resetPasswordExpires) {
            throw new common_1.BadRequestException('Невалідний або застарілий токен');
        }
        if (new Date() > user.resetPasswordExpires) {
            throw new common_1.BadRequestException('Токен прострочений');
        }
        const rounds = this.config.get('app.bcryptRounds') ?? 12;
        const passwordHash = await bcrypt.hash(dto.password, rounds);
        await this.userRepo.update(user.id, {
            passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            status: user_entity_1.UserStatus.ACTIVE,
        });
        this.logger.log(`Password reset for: ${user.email}`);
        return { message: 'Пароль успішно змінено' };
    }
    async changePassword(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.BadRequestException('Поточний пароль невірний');
        const rounds = this.config.get('app.bcryptRounds') ?? 12;
        const passwordHash = await bcrypt.hash(dto.newPassword, rounds);
        await this.userRepo.update(userId, { passwordHash });
        return { message: 'Пароль успішно змінено' };
    }
    async verifyEmail(token) {
        const user = await this.userRepo.findOne({
            where: { emailVerifyToken: token },
        });
        if (!user || !user.emailVerifyExpires) {
            throw new common_1.BadRequestException('Невалідний токен підтвердження');
        }
        if (new Date() > user.emailVerifyExpires) {
            throw new common_1.BadRequestException('Токен підтвердження прострочений');
        }
        await this.userRepo.update(user.id, {
            emailVerified: true,
            emailVerifyToken: null,
            emailVerifyExpires: null,
            status: user_entity_1.UserStatus.ACTIVE,
        });
        return { message: 'Email підтверджено' };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('jwt.secret'),
            expiresIn: this.config.get('jwt.expiresIn'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('jwt.refreshSecret'),
            expiresIn: this.config.get('jwt.refreshExpiresIn'),
        });
        const decoded = this.jwtService.decode(accessToken);
        const expiresIn = decoded.exp - decoded.iat;
        return { accessToken, refreshToken, expiresIn };
    }
    toAuthUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            status: user.status,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map