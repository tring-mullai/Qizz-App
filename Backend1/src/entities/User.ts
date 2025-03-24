// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Exam } from "./Exam";
import { Question } from "./question";
import { UserAnswer } from "./UserAnswer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ default: "student" }) // 'admin' or 'student'
  role!: string;

  // Relationships
  @OneToMany(() => Exam, (exam) => exam.createdBy)
  createdExams!: Exam[];

  @OneToMany(() => Question, (question) => question.createdBy)
  createdQuestions!: Question[];

  @OneToMany(() => UserAnswer, (answer) => answer.user)
  answers!: UserAnswer[];
}