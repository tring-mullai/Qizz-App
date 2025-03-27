import { DataSource } from "typeorm";
import { Exam } from "../entities/Exam";
import { Question } from "../entities/Question";
import { Score } from "../entities/Score";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Exam, Question, Score, User],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: [],
});