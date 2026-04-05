import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { CreateProjectDto, UpdateProjectDto, ListProjectsDto, AddMemberDto, UpdateMemberRoleDto, ProjectResponseDto, PaginatedProjectsDto } from './projects.dto';
export declare class ProjectsService {
    private readonly projectRepo;
    private readonly memberRepo;
    private readonly logger;
    constructor(projectRepo: Repository<Project>, memberRepo: Repository<ProjectMember>);
    listForUser(userId: string, query: ListProjectsDto): Promise<PaginatedProjectsDto>;
    getOne(projectId: string, userId: string): Promise<ProjectResponseDto>;
    create(dto: CreateProjectDto, ownerId: string): Promise<ProjectResponseDto>;
    update(projectId: string, dto: UpdateProjectDto, userId: string): Promise<ProjectResponseDto>;
    archive(projectId: string, userId: string): Promise<ProjectResponseDto>;
    remove(projectId: string, userId: string): Promise<{
        message: string;
    }>;
    getMembers(projectId: string, userId: string): Promise<ProjectMember[]>;
    addMember(projectId: string, dto: AddMemberDto, requesterId: string): Promise<ProjectMember>;
    updateMemberRole(projectId: string, memberId: string, dto: UpdateMemberRoleDto, requesterId: string): Promise<ProjectMember>;
    removeMember(projectId: string, memberId: string, requesterId: string): Promise<{
        message: string;
    }>;
    private findAccessible;
    private assertRole;
    private generateSlug;
    private toResponse;
}
