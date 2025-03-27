// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Score } from './Score';
import { Exam } from './Exam';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
  

  @OneToMany(() => Score, score => score.user)
  scores!: Score[];

  @OneToMany(() => Exam, exam => exam.creator)
  exams!: Exam[];
}
