import { ProjectType, ProjectStatus } from './project.entity';
import { UserRole } from './project-member.entity';
export declare class CreateProjectDto {
    name: string;
    slug?: string;
    domain?: string;
    projectType?: ProjectType;
    description?: string;
}
declare const UpdateProjectDto_base: import("@nestjs/common").Type<Partial<CreateProjectDto>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
    status?: ProjectStatus;
    seoDefaults?: Record<string, unknown>;
    settings?: Record<string, unknown>;
}
export declare class ListProjectsDto {
    status?: ProjectStatus;
    projectType?: ProjectType;
    page?: number;
    limit?: number;
    search?: string;
}
export declare class AddMemberDto {
    userId: string;
    role: UserRole;
}
export declare class UpdateMemberRoleDto {
    role: UserRole;
}
export declare class ProjectResponseDto {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    projectType: ProjectType;
    status: ProjectStatus;
    description: string | null;
    settings: Record<string, unknown>;
    seoDefaults: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    pagesCount?: number;
    membersCount?: number;
}
export declare class PaginatedProjectsDto {
    data: ProjectResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export {};
