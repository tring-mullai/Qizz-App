import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exam } from './Exam';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column('simple-array')
  options!: string[];

  @Column()
  correctAnswer!: number;

  @ManyToOne(() => Exam, exam => exam.questions)
  exam!: Exam;
}