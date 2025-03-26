import skillRoutes from './routes/skills-route.js';
import statementRoutes from './routes/statements-route.js';
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Welcome to the Express API!');
// })

app.use('/skills', skillRoutes);

app.use('/statements', statementRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));