import express from 'express';
import passport from '../saml-auth.js';
import User from '../models/User.js';

const router = express.Router();

// Route to initiate login
router.get('/login', (req, res, next) => {
  console.log("SSO login intitaied, calling Pasport");
  passport.authenticate('saml')(req, res, next);
  console.log("Redirecting to Identity Provider")
})

// Route to handle SAML response
router.post('/login/callback', 
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  async (req, res) => {
    console.log("SSO callback triggerd")
    console.log("Headers:", req.headers)
    console.log("Body", req.body)
    console.log("User:", req.user)
    console.log(`Logged in successfully. Welcome, ${req.user.nameID}!`);
    res.send("SSO callback recieved")
    try {
      if (!req.user) {
        console.error("No user data recieved from SAML")
        return res.status(400).send("UserA Authentication failed")
        
      }
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
      console.log("redirecting user to home page")
    res.json({message: "SSO successful", user: req.user}); // Redirect to home page after successful login
  } catch (err) {
    console.error('Error handling SAML login:', err)
    res.status(500).send("Internal Server Error")
  }
}
);

router.get("/login/callback", (req ,res) => {
  console.log("Get request to SAML callback recieved");
  res.send("SSO Callback page")
})

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
