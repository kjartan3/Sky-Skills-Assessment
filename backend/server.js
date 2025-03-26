import skillRoutes from './routes/skills-route.js';
import statementRoutes from './routes/statements-route.js';
import sequelize from './config/db.js';
import express from 'express'; // maybe change back to require
import cors from 'cors'; // maybe change back to require

const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Welcome to the Express API!');
// })

app.use('/skills', skillRoutes);

app.use('/statements', statementRoutes);

sequelize.sync.then(() => console.log('Database is synced')) // Ensures database schema is created and synced properly if not done already

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));