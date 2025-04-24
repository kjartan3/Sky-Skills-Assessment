import dotenv from 'dotenv'
dotenv.config()

import skillRoutes from './routes/skills-route.js';
import behaviourRoutes from './routes/behaviours-route.js';
import statementRoutes from './routes/statements-route.js';
import userRoutes from './routes/users-routes.js';
import assessmentRoutes from './routes/assessments-routes.js';
import statsRoutes from './routes/stats-routes.js';
import authRoutes from './routes/auth-routes.js';

import sequelize from './config/db.js';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser"



const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Add routes for skills and statements
app.use('/skills', skillRoutes);
app.use('/behaviours', behaviourRoutes); 
app.use('/statements', statementRoutes);
app.use('/users', userRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);




// Sync the database and handle errors
const startServer = async () => {
  try {
    // Syncing the database
    await sequelize.sync(); // Ensure tables are created (or synced if they exist)
    console.log('Database is synced!');

    // Start the server
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};



startServer();
