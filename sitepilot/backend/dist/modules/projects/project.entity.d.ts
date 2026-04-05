import { User } from '../users/user.entity';
export declare enum ProjectType {
    LANDING = "landing",
    MULTI_PAGE = "multi_page",
    CATALOG = "catalog",
    SERVICE_SITE = "service_site",
    SOLAR_COMMERCIAL = "solar_commercial"
}
export declare enum ProjectStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DRAFT = "draft",
    DELETED = "deleted"
}
export declare class Project {
    id: string;
    ownerId: string;
    owner: User;
    name: string;
    slug: string;
    domain: string | null;
    projectType: ProjectType;
    description: string | null;
    status: ProjectStatus;
    faviconUrl: string | null;
    thumbnailUrl: string | null;
    settings: Record<string, unknown>;
    seoDefaults: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    archivedAt: Date | null;
    deletedAt: Date | null;
}
