import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany ,JoinColumn} from 'typeorm';
import { User } from './User';
import { Question } from './Question';
import {Score} from './Score'

@Entity('Exams')
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
  @JoinColumn({ name: "creatorId" })
  creator!: User;

  @Column()
  creatorId!: number;

  @OneToMany(() => Question, question => question.exam, { 
    cascade: true, 
    onDelete: 'CASCADE'
  })
  questions!: Question[];

  @OneToMany(() => Score, (score) => score.exam,
{
  cascade: true, 
    onDelete: 'CASCADE'

})
  scores!: Score[];
}