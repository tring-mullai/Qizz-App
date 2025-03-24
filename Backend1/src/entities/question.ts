// entities/Question.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Exam } from "./Exam";
import { User } from "./User";
import { UserAnswer } from "./UserAnswer";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @Column()
  correctAnswer!: string;

  // Relationships
  @ManyToOne(() => Exam, (exam) => exam.questions)
  exam!: Exam;

  @ManyToOne(() => User, (user) => user.createdQuestions)
  createdBy!: User;

  @OneToMany(() => UserAnswer, (answer) => answer.question)
  answers!: UserAnswer[];
}