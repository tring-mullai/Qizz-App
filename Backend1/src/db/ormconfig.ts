import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "QUIZZ_APP",
  synchronize: false,  
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"]
});