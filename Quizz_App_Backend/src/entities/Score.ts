
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,JoinColumn,CreateDateColumn} from 'typeorm';
import { User } from './User';
import { Exam } from './Exam';

@Entity('scores') 
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'exam_id' })
  examId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => Exam, (exam) => exam.scores,{
    onDelete:'CASCADE'
  })
  @JoinColumn({ name: 'exam_id' })
  exam!: Exam;

  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('float')
  percentage!: number;

  @Column('text', { name: 'answers' })
  answers!: string;

  @CreateDateColumn({ name: 'submit_date' })
  submitDate!: Date;
}