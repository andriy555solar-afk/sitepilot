import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';
export declare class ProjectsService {
    private repo;
    constructor(repo: Repository<Project>);
    create(user: User, data: any): Promise<Project[]>;
    findAll(user: User): Promise<Project[]>;
}
