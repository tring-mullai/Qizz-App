// src/entity/Question.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exam } from './Exam';

@Entity() // Explicitly set table name to avoid conflicts
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column('simple-array')
  options!: string[];

  @Column({ name: 'correct_answer' }) // Explicitly map column name
  correctAnswer!: number;

  @ManyToOne(() => Exam, exam => exam.questions)
  exam!: Exam;
}