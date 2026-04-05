import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '/' })
  slug: string;

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.DRAFT,
  })
  status: PageStatus;

  @ManyToOne(() => Project)
  project: Project;
}
