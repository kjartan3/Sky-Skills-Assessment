import express from 'express';
import passport from '../saml-auth.js';
import User from '../models/User.js';

const router = express.Router();

// Route to initiate login
router.get('/login', passport.authenticate('saml', { failureRedirect: '/login/fail' }));

// Route to handle SAML response
router.post('/login/callback', 
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  async (req, res) => {
    console.log(`Logged in successfully. Welcome, ${req.user.nameID}!`);
    try {
      const {nameId, email} = req.user
      
      let user = await User.findOne({ where: { userId: nameId }})
      if (!user) {
        user = await User.create({
          userId: nameId,
          email: email || 'No email provided'
        });
        console.log(`New user created: ${nameId}`)
      } else {
        console.log(`User ${nameId} found in database`)
      }
    res.redirect('/'); // Redirect to home page after successful login
  } catch (err) {
    console.error('Error handling SAML login:', err)
    res.status(500).send("Internal Server Error")
  }
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
            userId: req.user.nameID || 'Unknown User', // Graceful fallback for name
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
