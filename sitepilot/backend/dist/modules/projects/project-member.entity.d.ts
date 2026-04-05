import { User } from '../users/user.entity';
import { Project } from './project.entity';
export declare enum UserRole {
    OWNER = "owner",
    MANAGER = "manager",
    EDITOR = "editor",
    TECHNICAL = "technical",
    VIEWER = "viewer"
}
export declare class ProjectMember {
    id: string;
    projectId: string;
    project: Project;
    userId: string;
    user: User;
    role: UserRole;
    addedBy: string | null;
    permissions: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
