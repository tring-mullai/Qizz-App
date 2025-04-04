import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { Exam } from './Exam';

@Entity('Questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column('simple-array')
  options!: string[];

  @Column()
  correctAnswer!: number;

  @ManyToOne(() => Exam, exam => exam.questions, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: "examId" })
  exam!: Exam;

  @Column()
  examId!: number;
}