require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {postgraphile} = require('postgraphile')
import "reflect-metadata";
import { Repository } from "typeorm";
import { Users } from "./entity/user";
import { AppDataSource } from "./ormconfig";

const app = express();

const userRepository: Repository<Users> = AppDataSource.getRepository(Users);

app.use(express.json());
app.use(cors());
app.use(
    postgraphile(process.env.DATABASE_URL, "public", {
      watchPg: true, // Automatically update schema changes
      graphiql: true, // Enable GraphiQL interface
      enhanceGraphiql: true, // Better UI for GraphiQL
      dynamicJson: true, // Return JSON fields as objects
      enableCors: true, // Allow CORS
    })
  );
// app.use('/api/auth', authRoutes);
// app.use('/api/exams', examRoutes);
// app.use('/api/scores', scoreRoutes);

app.listen(5001, () => console.log('Server running on port 5000'));