// src/entity/Score.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Exam } from './Exam';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.scores)
  user!: User;

  @ManyToOne(() => Exam)
  exam!: Exam;

  @Column('float')
  percentage!: number;

  @Column('json')
  answers!: Record<string, number>;

  @Column('json')
  questions!: any;
}
