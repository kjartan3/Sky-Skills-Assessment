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
import samlMetaDataRoutes from './routes/saml-metadata.js';
import pdfRoutes from "./routes/pdf-routes.js";
import contentRoutes from "./routes/contents-routes.js";

dotenv.config()

const app = express();
// 1. Add proper body parsers - crucial for SAML POST responses
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for SAML POST responses

// 2. Update CORS configuration
app.use(cors({
  origin: `${process.env.FRONT_END_URL}`, // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'], // This allows the browser to see the cookie headers
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
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Required for cross-domain cookies with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: 'none', // Required for cross-domain cookies
    
  },
}));

// 4. Initialize Passport with these specific settings
app.use(passport.initialize());
app.use(passport.session());

// Add routes for skills, statements, and SAML
app.use('/skills', skillRoutes);
app.use('/behaviours', behaviourRoutes); 
app.use('/statements', statementRoutes);
app.use('/users', userRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);
app.use('/metadata', samlMetaDataRoutes);
app.use('/pdf', pdfRoutes);
app.use('/content', contentRoutes);

const options = {
  key: fs.readFileSync("ssl/server.key"),
  cert: fs.readFileSync("ssl/server.crt"),
};

app.get('/metadata', (req, res) => {
  try {
    const strategy = passport._strategies.saml;
    const metadata = strategy.generateServiceProviderMetadata();
    
    res.header('Content-Type', 'text/xml').send(metadata);
  } catch (error) {
    console.error('Error generating SAML metadata:', error);
    res.status(500).send('Error generating metadata');
  }
});

app.use((req, res, next) => {
  if (!req.isAuthenticated) {
    req.isAuthenticated = function() {
      return !!(req.user);
    };
  }
  next();
});

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
