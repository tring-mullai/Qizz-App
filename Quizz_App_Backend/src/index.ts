import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { postgraphile } from 'postgraphile';
import jwt from "jsonwebtoken";
import { AddQuestionsPlugin } from './auth/plugin/AddQuestion';
import { CreateExamWithQuestionsPlugin } from './auth/plugin/createExam';
import { ExamAttendeesPlugin } from './auth/plugin/examAttendees';
import { UpdateExamQuestionsPlugin } from './auth/plugin/updateExamQuestions';
import { AppDataSource } from './db/ormconfig';

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

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

// Function to get user by ID using TypeORM
const getUserById = async (userId: number) => {
  try {
    const user = await AppDataSource.manager.findOne('User', { 
      where: { id: userId } 
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

app.use(
  postgraphile(process.env.DATABASE_URL, 'public', {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    enableCors: false,
    retryOnInitFail: true,
    appendPlugins: [
      AddQuestionsPlugin,
      CreateExamWithQuestionsPlugin,
      ExamAttendeesPlugin,
      UpdateExamQuestionsPlugin
    ],
    pgSettings: async (req) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return {};
      
      try {
        const token = authHeader.split(' ')[1];
        
        // Verify token signature
        const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        
        // Check if user exists
        const user = await getUserById(userId);
        if (!user) {
          return {};
        }
        
        return {
          'jwt.claims.user_id': userId
        };
      } catch (e) {
        return {};
      }
    },
    additionalGraphQLContextFromRequest: async (req) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return {};
      
      try {
        const token = authHeader.split(' ')[1];
        
        // Verify token signature
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        
        // Check if user exists
        const user = await getUserById(decodedToken.userId);
        if (!user) {
          return {};
        }
        
        return { user: decodedToken };
      } catch (e) {
        return {};
      }
    }
  })
);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PostGraphile API: http://localhost:${PORT}/graphql`);
});