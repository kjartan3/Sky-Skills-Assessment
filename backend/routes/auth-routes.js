import express from 'express';
import passport from '../saml-auth.js';
import User from '../models/User.js';
import dotenv from 'dotenv'
const router = express.Router();
dotenv.config()

// Route to initiate login
router.get('/login', (req, res, next) => {
  // console.log("Initiating SAML authentication flow");
  
  // Store the original URL to redirect back after authentication
  req.session.returnTo = req.query.returnTo || `${process.env.FRONT_END_URL}`;
  
  passport.authenticate('saml')(req, res, next);
});

// Route to handle SAML response - POST is the standard for SAML assertions
router.post('/login/callback', 
  express.urlencoded({ extended: false }), // Important: parse the SAML response
  (req, res, next) => {
    // console.log("SAML callback POST received");
    // Don't log sensitive information in production
    
    // Save returnTo URL before passport potentially modifies the session
    const returnTo = req.session.returnTo || `${process.env.FRONT_END_URL}`;
    
    passport.authenticate('saml', {
      failureRedirect: '/auth/login/fail',
      failureFlash: true,
      session: true
    })(req, res, next);
  },
  async (req, res) => {
    // console.log("SAML authentication successful");
    
    try {
      if (!req.user) {
        console.error("No user data received from SAML");
        return res.status(400).send("User Authentication failed");
      }
      
      // Now req.user should contain user data from SAML
      const { nameID, email } = req.user;
      
      // Find or create user in your database
      let user = await User.findOne({ where: { userId: nameID } });
      if (!user) {
        user = await User.create({
          userId: nameID,
          email: email || 'No email provided'
        });
        console.log(`New user created: ${nameID}`);
      } else {
        console.log(`User ${nameID} found in database`);
      }
      
      // Get the return URL from the session
      const returnTo = req.session.returnTo || `${process.env.FRONT_END_URL}`;
      delete req.session.returnTo; // Clean up
      
      console.log(`Redirecting authenticated user to: ${returnTo}`);
      res.redirect(returnTo);
    } catch (err) {
      console.error('Error handling SAML login:', err);
      res.status(500).send("Internal Server Error");
    }
  }
);


// Login failure route
router.get('/login/fail', (req, res) => {
  console.error("SAML authentication failed");
  res.status(401).send('Login failed. Please try again.');
});

// Route to fetch user info
router.get('/user-info', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const userInfo = {
            userId: req.user.nameID || 'Unknown User',
            email: req.user.email || 'No email provided',
        };
        res.json(userInfo);
    } else {
        res.status(401).json({ 
            message: 'User not authenticated. Please log in via SSO.',
            redirect: '/auth/login' 
        });
    }
});

router.get("/debug-session", (req, res) => {
  // Sanitize session data for debugging - don't expose all data in production
  const sanitizedSession = { 
    authenticated: req.isAuthenticated(),
    userId: req.user?.nameID,
    // Add other non-sensitive session data as needed
  };
  
  res.json({ session: sanitizedSession });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      console.error('Error during logout:', err);
      return res.status(500).send('Error during logout');
    }
    res.redirect(`${process.env.FRONT_END_URL}`);
  });
});

export default router;