import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export declare const IS_PUBLIC = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
import { Repository } from 'typeorm';
import { ProjectMember, UserRole } from '../projects/project-member.entity';
import { Project } from '../projects/project.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class ProjectRoleGuard implements CanActivate {
    private readonly reflector;
    private readonly memberRepo;
    private readonly projectRepo;
    constructor(reflector: Reflector, memberRepo: Repository<ProjectMember>, projectRepo: Repository<Project>);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
export {};
