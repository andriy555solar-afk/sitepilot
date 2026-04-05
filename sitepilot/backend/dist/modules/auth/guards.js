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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoleGuard = exports.Roles = exports.ROLES_KEY = exports.JwtAuthGuard = exports.Public = exports.IS_PUBLIC = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
exports.IS_PUBLIC = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC, true);
exports.Public = Public;
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(ctx) {
        const isPublic = this.reflector.getAllAndOverride(exports.IS_PUBLIC, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic)
            return true;
        return super.canActivate(ctx);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_member_entity_1 = require("../projects/project-member.entity");
const project_entity_1 = require("../projects/project.entity");
const common_2 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
let ProjectRoleGuard = class ProjectRoleGuard {
    constructor(reflector, memberRepo, projectRepo) {
        this.reflector = reflector;
        this.memberRepo = memberRepo;
        this.projectRepo = projectRepo;
    }
    async canActivate(ctx) {
        const requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0)
            return true;
        const request = ctx.switchToHttp().getRequest();
        const userId = request.user?.id;
        const projectId = request.params?.projectId;
        if (!userId || !projectId)
            return false;
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
            withDeleted: false,
        });
        if (!project)
            throw new common_2.NotFoundException('Проєкт не знайдено');
        if (project.status === project_entity_1.ProjectStatus.DELETED) {
            throw new common_2.NotFoundException('Проєкт не знайдено');
        }
        if (project.ownerId === userId)
            return true;
        const member = await this.memberRepo.findOne({
            where: { projectId, userId },
        });
        if (!member)
            throw new common_2.ForbiddenException('Немає доступу до цього проєкту');
        if (!requiredRoles.includes(member.role)) {
            throw new common_2.ForbiddenException(`Для цієї дії потрібна роль: ${requiredRoles.join(' або ')}`);
        }
        request.memberRole = member.role;
        return true;
    }
};
exports.ProjectRoleGuard = ProjectRoleGuard;
exports.ProjectRoleGuard = ProjectRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(project_member_entity_1.ProjectMember)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectRoleGuard);
//# sourceMappingURL=guards.js.map