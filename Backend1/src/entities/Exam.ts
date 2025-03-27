// src/entity/Exam.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  duration!: number; // in minutes

  @ManyToOne(() => User, user => user.exams)
  creator!: User;

  @OneToMany(() => Question, question => question.exam, { cascade: true })
  questions!: Question[];
}