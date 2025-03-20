import "reflect-metadata";
import express from "express";
import { AppDataSource } from "../src/data-source";

const {postgraphile} = require('postgraphile')

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(
    postgraphile(process.env.DATABASE_URL, "public", {
      watchPg: true, // Automatically update schema changes
      graphiql: true, // Enable GraphiQL interface
      enhanceGraphiql: true, // Better UI for GraphiQL
      dynamicJson: true, // Return JSON fields as objects
      enableCors: true, // Allow CORS
    })
  );

AppDataSource.initialize()
  .then(() => {
    console.log("📌 Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Database connection failed:", error));
