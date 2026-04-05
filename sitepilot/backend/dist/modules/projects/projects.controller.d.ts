import { ProjectsService } from './projects.service';
import { PagesService } from './pages.service';
export declare class ProjectsController {
    private projectsService;
    private pagesService;
    constructor(projectsService: ProjectsService, pagesService: PagesService);
    create(req: any, body: any): Promise<import("./project.entity").Project[]>;
    findAll(req: any): Promise<import("./project.entity").Project[]>;
    publish(id: string): Promise<import("typeorm").UpdateResult>;
}
