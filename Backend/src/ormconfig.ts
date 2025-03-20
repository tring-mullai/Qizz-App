import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "Exam_tool_graphql",
  synchronize: false,  
  logging: true,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"]
});

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((error) => console.log("Database Connection Failed!", error));
