import skillRoutes from './routes/skills-route.js';
import behaviourRoutes from './routes/behaviours-route.js';
import statementRoutes from './routes/statements-route.js';
import sequelize from './config/db.js';
import express from 'express';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

// Add routes for skills and statements
app.use('/skills', skillRoutes);
app.use('/behaviours', behaviourRoutes); // Routes for behaviours and their corresponding statements
app.use('/statements', statementRoutes);



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
