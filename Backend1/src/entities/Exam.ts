// entities/Exam.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Question } from "./question";
import { UserAnswer } from "./UserAnswer";
@Entity()
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.createdExams)
  createdBy!: User;

  @OneToMany(() => Question, (question) => question.exam)
  questions!: Question[];

  @OneToMany(() => UserAnswer, (answer) => answer.exam)
  answers!: UserAnswer[];
}