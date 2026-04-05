import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Page } from './page.entity';
import { ProjectsService } from './projects.service';
import { PagesService } from './pages.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Page])],
  providers: [ProjectsService, PagesService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
