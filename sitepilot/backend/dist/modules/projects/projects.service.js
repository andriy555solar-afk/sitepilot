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
var ProjectsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./project.entity");
const project_member_entity_1 = require("./project-member.entity");
let ProjectsService = ProjectsService_1 = class ProjectsService {
    constructor(projectRepo, memberRepo) {
        this.projectRepo = projectRepo;
        this.memberRepo = memberRepo;
        this.logger = new common_1.Logger(ProjectsService_1.name);
    }
    async listForUser(userId, query) {
        const { status, projectType, page = 1, limit = 20, search } = query;
        const skip = (page - 1) * Math.min(limit, 100);
        const qb = this.projectRepo
            .createQueryBuilder('p')
            .leftJoin('project_members', 'pm', 'pm.project_id = p.id AND pm.user_id = :userId', { userId })
            .where('(p.owner_id = :userId OR pm.user_id = :userId)', { userId })
            .andWhere('p.deleted_at IS NULL');
        if (status)
            qb.andWhere('p.status = :status', { status });
        if (projectType)
            qb.andWhere('p.project_type = :projectType', { projectType });
        if (search)
            qb.andWhere('p.name ILIKE :search', { search: `%${search}%` });
        const [projects, total] = await qb
            .orderBy('p.updated_at', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data: projects.map(this.toResponse),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getOne(projectId, userId) {
        const project = await this.findAccessible(projectId, userId);
        return this.toResponse(project);
    }
    async create(dto, ownerId) {
        const slug = dto.slug ?? this.generateSlug(dto.name);
        const exists = await this.projectRepo.findOne({
            where: { ownerId, slug },
        });
        if (exists)
            throw new common_1.ConflictException(`Slug "${slug}" вже використовується`);
        const project = this.projectRepo.create({
            ...dto,
            slug,
            ownerId,
            status: project_entity_1.ProjectStatus.DRAFT,
        });
        await this.projectRepo.save(project);
        this.logger.log(`Project created: ${project.id} by ${ownerId}`);
        return this.toResponse(project);
    }
    async update(projectId, dto, userId) {
        const project = await this.findAccessible(projectId, userId);
        await this.assertRole(projectId, userId, project.ownerId, [
            project_member_entity_1.UserRole.OWNER, project_member_entity_1.UserRole.MANAGER,
        ]);
        if (dto.slug && dto.slug !== project.slug) {
            const slugConflict = await this.projectRepo.findOne({
                where: { ownerId: project.ownerId, slug: dto.slug },
            });
            if (slugConflict)
                throw new common_1.ConflictException(`Slug "${dto.slug}" вже використовується`);
        }
        Object.assign(project, dto);
        await this.projectRepo.save(project);
        return this.toResponse(project);
    }
    async archive(projectId, userId) {
        const project = await this.findAccessible(projectId, userId);
        await this.assertRole(projectId, userId, project.ownerId, [project_member_entity_1.UserRole.OWNER]);
        project.status = project_entity_1.ProjectStatus.ARCHIVED;
        project.archivedAt = new Date();
        await this.projectRepo.save(project);
        return this.toResponse(project);
    }
    async remove(projectId, userId) {
        const project = await this.findAccessible(projectId, userId);
        await this.assertRole(projectId, userId, project.ownerId, [project_member_entity_1.UserRole.OWNER]);
        await this.projectRepo.softDelete(projectId);
        this.logger.warn(`Project soft-deleted: ${projectId} by ${userId}`);
        return { message: 'Проєкт видалено' };
    }
    async getMembers(projectId, userId) {
        await this.findAccessible(projectId, userId);
        return this.memberRepo.find({
            where: { projectId },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async addMember(projectId, dto, requesterId) {
        const project = await this.findAccessible(projectId, requesterId);
        await this.assertRole(projectId, requesterId, project.ownerId, [
            project_member_entity_1.UserRole.OWNER, project_member_entity_1.UserRole.MANAGER,
        ]);
        if (dto.userId === project.ownerId) {
            throw new common_1.BadRequestException('Власник вже має повний доступ');
        }
        const existing = await this.memberRepo.findOne({
            where: { projectId, userId: dto.userId },
        });
        if (existing)
            throw new common_1.ConflictException('Користувач вже є учасником');
        const member = this.memberRepo.create({
            projectId,
            userId: dto.userId,
            role: dto.role,
            addedBy: requesterId,
        });
        return this.memberRepo.save(member);
    }
    async updateMemberRole(projectId, memberId, dto, requesterId) {
        const project = await this.findAccessible(projectId, requesterId);
        await this.assertRole(projectId, requesterId, project.ownerId, [project_member_entity_1.UserRole.OWNER]);
        const member = await this.memberRepo.findOne({ where: { id: memberId, projectId } });
        if (!member)
            throw new common_1.NotFoundException('Учасника не знайдено');
        member.role = dto.role;
        return this.memberRepo.save(member);
    }
    async removeMember(projectId, memberId, requesterId) {
        const project = await this.findAccessible(projectId, requesterId);
        await this.assertRole(projectId, requesterId, project.ownerId, [
            project_member_entity_1.UserRole.OWNER, project_member_entity_1.UserRole.MANAGER,
        ]);
        const member = await this.memberRepo.findOne({ where: { id: memberId, projectId } });
        if (!member)
            throw new common_1.NotFoundException('Учасника не знайдено');
        await this.memberRepo.remove(member);
        return { message: 'Учасника видалено' };
    }
    async findAccessible(projectId, userId) {
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
        });
        if (!project)
            throw new common_1.NotFoundException('Проєкт не знайдено');
        if (project.status === project_entity_1.ProjectStatus.DELETED) {
            throw new common_1.NotFoundException('Проєкт не знайдено');
        }
        if (project.ownerId === userId)
            return project;
        const member = await this.memberRepo.findOne({
            where: { projectId, userId },
        });
        if (!member)
            throw new common_1.ForbiddenException('Немає доступу до цього проєкту');
        return project;
    }
    async assertRole(projectId, userId, ownerId, allowedRoles) {
        if (userId === ownerId)
            return;
        const member = await this.memberRepo.findOne({ where: { projectId, userId } });
        if (!member || !allowedRoles.includes(member.role)) {
            throw new common_1.ForbiddenException(`Потрібна роль: ${allowedRoles.join(' або ')}`);
        }
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 200);
    }
    toResponse(p) {
        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            domain: p.domain,
            projectType: p.projectType,
            status: p.status,
            description: p.description,
            settings: p.settings,
            seoDefaults: p.seoDefaults,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = ProjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_member_entity_1.ProjectMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map