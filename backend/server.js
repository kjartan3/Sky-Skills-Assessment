import dotenv from 'dotenv';
import https from 'https'
import fs from 'fs'
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import passport from './saml-auth.js'; // Import the SAML module
import session from 'express-session'; // Import express-session


import skillRoutes from './routes/skills-route.js';
import behaviourRoutes from './routes/behaviours-route.js';
import statementRoutes from './routes/statements-route.js';
import userRoutes from './routes/users-routes.js';
import assessmentRoutes from './routes/assessments-routes.js';
import statsRoutes from './routes/stats-routes.js';
import authRoutes from './routes/auth-routes.js';
import samlMetaDataRoutes from './routes/saml-metadata.js'

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://10.133.198.64:3000",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Secure server running")
})

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method}`)
  next();
})

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Replace with a strong secret
    resave: false, // Prevent resaving unchanged sessions
    saveUninitialized: false, // Avoid creating empty sessions
    cookie: {
        secure: true, // Set to true in production with HTTPS
        httpOnly: true, // Prevent JavaScript access to cookies
        maxAge: 1000 * 60 * 60, // Session expires in 1 hour
        sameSite: "none",
    },
}));

// Initialize Passport middleware for session management
app.use(passport.initialize());
app.use(passport.session()); // Enable session support in Passport

// Add routes for skills, statements, and SAML
app.use('/skills', skillRoutes);
app.use('/behaviours', behaviourRoutes); 
app.use('/statements', statementRoutes);
app.use('/users', userRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);
app.use('/metadata', samlMetaDataRoutes)

const options = {
  key: fs.readFileSync("ssl/server.key"),
  cert: fs.readFileSync("ssl/server.crt"),
};

// Sync the database and start the server
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database is synced!');
    const PORT = 5000;
    https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

startServer();
