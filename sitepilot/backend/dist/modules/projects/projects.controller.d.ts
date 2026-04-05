import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ListProjectsDto, AddMemberDto, UpdateMemberRoleDto, ProjectResponseDto, PaginatedProjectsDto } from './projects.dto';
import { RequestUser } from '../auth/jwt.strategy';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    list(user: RequestUser, query: ListProjectsDto): Promise<PaginatedProjectsDto>;
    getOne(projectId: string, user: RequestUser): Promise<ProjectResponseDto>;
    create(dto: CreateProjectDto, user: RequestUser): Promise<ProjectResponseDto>;
    update(projectId: string, dto: UpdateProjectDto, user: RequestUser): Promise<ProjectResponseDto>;
    archive(projectId: string, user: RequestUser): Promise<ProjectResponseDto>;
    remove(projectId: string, user: RequestUser): Promise<{
        message: string;
    }>;
    getMembers(projectId: string, user: RequestUser): Promise<import("./project-member.entity").ProjectMember[]>;
    addMember(projectId: string, dto: AddMemberDto, user: RequestUser): Promise<import("./project-member.entity").ProjectMember>;
    updateMemberRole(projectId: string, memberId: string, dto: UpdateMemberRoleDto, user: RequestUser): Promise<import("./project-member.entity").ProjectMember>;
    removeMember(projectId: string, memberId: string, user: RequestUser): Promise<{
        message: string;
    }>;
}
