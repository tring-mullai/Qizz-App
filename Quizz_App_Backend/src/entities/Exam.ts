import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity('Exam')
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  duration!: number; 

  @ManyToOne(() => User, user => user.exams)
  creator!: User;

  @OneToMany(() => Question, question => question.exam, { cascade: true })
  questions!: Question[];
}