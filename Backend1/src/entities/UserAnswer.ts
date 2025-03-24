// entities/UserAnswer.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Question } from "./question";
import { Exam } from "./Exam";

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  answer!: string; // Student's submitted answer

  // Relationships
  @ManyToOne(() => User, (user) => user.answers)
  user!: User;

  @ManyToOne(() => Question, (question) => question.answers)
  question!: Question;

  @ManyToOne(() => Exam, (exam) => exam.answers)
  exam!: Exam;
}