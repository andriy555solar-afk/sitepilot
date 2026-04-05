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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const projects_dto_1 = require("./projects.dto");
const guards_1 = require("../auth/guards");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    list(user, query) {
        return this.projectsService.listForUser(user.id, query);
    }
    getOne(projectId, user) {
        return this.projectsService.getOne(projectId, user.id);
    }
    create(dto, user) {
        return this.projectsService.create(dto, user.id);
    }
    update(projectId, dto, user) {
        return this.projectsService.update(projectId, dto, user.id);
    }
    archive(projectId, user) {
        return this.projectsService.archive(projectId, user.id);
    }
    remove(projectId, user) {
        return this.projectsService.remove(projectId, user.id);
    }
    getMembers(projectId, user) {
        return this.projectsService.getMembers(projectId, user.id);
    }
    addMember(projectId, dto, user) {
        return this.projectsService.addMember(projectId, dto, user.id);
    }
    updateMemberRole(projectId, memberId, dto, user) {
        return this.projectsService.updateMemberRole(projectId, memberId, dto, user.id);
    }
    removeMember(projectId, memberId, user) {
        return this.projectsService.removeMember(projectId, memberId, user.id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Список проєктів поточного користувача' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: projects_dto_1.PaginatedProjectsDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, projects_dto_1.ListProjectsDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Деталі проєкту' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: projects_dto_1.ProjectResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Проєкт не знайдено' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Створити новий проєкт' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: projects_dto_1.ProjectResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [projects_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити проєкт (owner / manager)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: projects_dto_1.ProjectResponseDto }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, projects_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':projectId/archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Архівувати проєкт (тільки owner)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "archive", null);
__decorate([
    (0, common_1.Delete)(':projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити проєкт (soft delete, тільки owner)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':projectId/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Учасники проєкту' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(':projectId/members'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Додати учасника (owner / manager)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, projects_dto_1.AddMemberDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Patch)(':projectId/members/:memberId/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Змінити роль учасника (тільки owner)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('memberId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, projects_dto_1.UpdateMemberRoleDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)(':projectId/members/:memberId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити учасника (owner / manager)' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', type: 'string', format: 'uuid' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('memberId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeMember", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map