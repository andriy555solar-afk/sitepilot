import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
  ) {}

  create(user: User, data: any) {
    const project = this.repo.create({
      ...data,
      owner: user,
    });
    return this.repo.save(project);
  }

  findAll(user: User) {
    return this.repo.find({
      where: { owner: { id: user.userId } },
    });
  }
}
