require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { postgraphile } from 'postgraphile';
import { User } from './entities/User';
import { authPlugin } from './auth/plugin/authPlugin';
import { AppDataSource } from './db/ormconfig';
import jwt from "jsonwebtoken";


const app = express();

app.use(express.json());
app.use(cors());

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
    postgraphile(process.env.DATABASE_URL, 'public', {
        watchPg: true, // Automatically update schema changes
        graphiql: true, // Enable GraphiQL interface
        enhanceGraphiql: true, // Better UI for GraphiQL
        dynamicJson: true, // Return JSON fields as objects
        enableCors: true, // Allow CORS
        appendPlugins: [authPlugin], // Add custom plugin
        // pgSettings: (req) => {
        //     // Pass user ID to PostgreSQL (ensure req.user is populated)
        //     return {
        //         'user.id': req.user?.id || null,
        //     };
        // },
        additionalGraphQLContextFromRequest: async (req) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) 
            {
                throw new Error('Token required')
            } // Allow public queries
          
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number };
              const user = await AppDataSource.getRepository(User).findOne({ 
                where: { id: decoded.userId } 
              });
              return { user }; // Attach user to context
            } catch (error) {
              throw new Error('Invalid token');
            }
          },
    })
);

// Start the server
app.listen(5001, () => {
    console.log('Server running on port 5001');
    console.log(`PostGraphile API: http://localhost:5001/graphql`);
});