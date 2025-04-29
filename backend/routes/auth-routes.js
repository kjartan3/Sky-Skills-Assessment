import express from 'express';
import passport from '../saml-auth.js';

const router = express.Router();

// Route to initiate login
router.get('/login', passport.authenticate('saml', { failureRedirect: '/login/fail' }));

// Route to handle SAML response
router.post('/login/callback', 
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  (req, res) => {
    console.log(`Logged in successfully. Welcome, ${req.user.nameID}!`);
    res.redirect('/'); // Redirect to home page after successful login
  }
);

// Login failure route
router.get('/login/fail', (req, res) => {
  res.status(401).send('Login failed. Please try again.');
});

// Route to fetch user info
router.get('/user-info', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const userInfo = {
            name: req.user.nameID || 'Unknown User', // Graceful fallback for name
            email: req.user.email || 'No email provided', // Handle missing attributes
        };
        res.json(userInfo);
    } else {
        res.status(401).json({ 
            message: 'User not authenticated. Please log in via SSO.',
            redirect: '/auth/login' 
        });
    }
});

export default router;
