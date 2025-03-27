import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { postgraphile } from 'postgraphile';
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';

// Import your plugins
import { authPlugin } from './auth/plugin/authPlugin';
import { CreateExamWithQuestionsPlugin } from './auth/plugin/createExam';
import { ExamAttendeesPlugin } from './auth/plugin/examAttendees';
import { UpdateExamQuestionsPlugin } from './auth/plugin/updateExamQuestions';
import { AppDataSource } from './db/ormconfig';

// Create a centralized type definition plugin to avoid conflicts
// Update your SharedTypesPlugin in src/index.ts
const SharedTypesPlugin = makeExtendSchemaPlugin(() => ({
    typeDefs: gql`
      input QuestionInputType {
        text: String!
        options: [String!]!
        correctAnswer: Int!
      }
  
      type Question {
        id: Int!
        text: String!
        options: [String!]!
        correctAnswer: Int!
      }
  
      type User {
        id: Int!
        email: String!
        name: String!
      }
    `
  }));

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: ['GET', 'POST', 'OPTIONS']
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

// PostGraphile middleware for auto-generated GraphQL API
app.use(
    postgraphile(process.env.DATABASE_URL, 'public', { // Add other schemas if needed
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      dynamicJson: true,
      enableCors: false,
      appendPlugins: [
        SharedTypesPlugin,
        authPlugin,
        CreateExamWithQuestionsPlugin,
        ExamAttendeesPlugin,
        UpdateExamQuestionsPlugin
      ],
    })
  );

// Start the server
app.listen(5001, () => {
  console.log('Server running on port 5001');
  console.log(`PostGraphile API: http://localhost:5001/graphql`);
});