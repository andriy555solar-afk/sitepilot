import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { PagesService } from './pages.service';

@Controller()
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private pagesService: PagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('projects')
  create(@Req() req: any, @Body() body: any) {
    return this.projectsService.create(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects')
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pages/:id/publish')
  publish(@Param('id') id: string) {
    return this.pagesService.publish(id);
  }
}
