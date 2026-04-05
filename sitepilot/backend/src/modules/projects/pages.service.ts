import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageStatus } from './page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private repo: Repository<Page>,
  ) {}

  publish(id: string) {
    return this.repo.update(id, {
      status: PageStatus.PUBLISHED,
    });
  }
}
