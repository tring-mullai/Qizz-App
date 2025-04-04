import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { postgraphile } from 'postgraphile';
import jwt from "jsonwebtoken";
import { AddQuestionsPlugin } from './auth/plugin/AddQuestion';
import { examPlugin } from './auth/plugin/createExam';
import { attendeesPlugin } from './auth/plugin/examAttendees';
import { updateExamPlugin } from './auth/plugin/updateExamQuestions';
import { AppDataSource } from './db/ormconfig';
import { authPlugin } from './auth/plugin/authPlugin';
import {submitPlugin } from './auth/plugin/SubmitExamPlugin';

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
    enableCors: true, // Allow frontend requests
    retryOnInitFail: true,
    appendPlugins: [
      authPlugin,
      // AddQuestionsPlugin,
      examPlugin,
      attendeesPlugin,
      updateExamPlugin,
      submitPlugin
    ],

    additionalGraphQLContextFromRequest: async (req,res) => {
      console.log('Checking authentication for a new request...');
      const authHeader = req.headers.authorization;
      const operationName = req.body?.operationName

      if(operationName === "guest")
      {
        return {req,res};
      }
      
      if (!authHeader) {
        console.log('No Authorization header found.');
        throw new Error("Valid token is required")
      }
    
      try {
        const token = authHeader.split(' ')[1];
    
        // Ensure JWT_SECRET is defined
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET is not defined in environment variables");
        }
    
        // Verify token
        const decodedToken = jwt.verify(token, secret) as { userId: number };
    
        console.log('User authenticated:', decodedToken);
    
        // Fetch user details
        const user = await getUserById(decodedToken.userId);
        if (!user) {
          console.log('User not found.');
          return {};
        }
    
        return { user: decodedToken };
      } catch (e) {
        if (e instanceof Error) {
          console.log('Invalid token:', e.message);
        } else {
          console.log('An unknown error occurred');
        }
        return {};
      }
    }
    
  })
);


const PORT =  5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PostGraphile API: http://localhost:${PORT}/graphiql`);
});