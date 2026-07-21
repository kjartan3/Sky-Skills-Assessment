import express from 'express';
import passport from '../saml-auth.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { getAccessToken, fetchUserProfile, getUserProfile } from '../utils/fetchUserProfile.js';

const router = express.Router();
dotenv.config();

// Route to initiate login
router.get('/login', (req, res, next) => {
  // Store the original URL to redirect back after authentication
  req.session.returnTo = req.query.returnTo || `${process.env.FRONT_END_URL}`;
  passport.authenticate('saml')(req, res, next);
});

// Route to handle SAML response - POST is the standard for SAML assertions
router.post('/login/callback', 
  express.urlencoded({ extended: false }), // Important: parse the SAML response
  (req, res, next) => {
    // Save returnTo URL before passport potentially modifies the session
    const returnTo = req.session.returnTo || `${process.env.FRONT_END_URL}`;
    passport.authenticate('saml', {
      failureRedirect: '/auth/login/fail',
      failureFlash: true,
      session: true
    })(req, res, next);
  },
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("No user data received from SAML");
        return res.status(400).send("User Authentication failed");
      }

      const userId = req.user.nameID;
      console.log(`🔐 Processing login for userId: ${userId}`);

      // Find or create user in your database
      let user = await User.findOne({ where: { userId } });

      if (!user) {
        try {
          // Use the convenience function that handles token generation
          const profile = await getUserProfile(userId);
          
          console.log('✅ Profile fetched:', profile);

          if (!profile) {
            console.warn(`⚠️ No profile found for user ID: ${userId}`);
            return res.status(404).send('User profile not found');
          }

          // Use the camelCase properties from the updated fetchUserProfile
          user = await User.create({
            userId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            orgUnit: profile.orgUnit,
            band: profile.band
          });

          console.log(`✅ New user created: ${userId} - ${profile.firstName} ${profile.lastName}`);
        } catch (err) {
          console.error(`❌ Failed to fetch user profile: ${userId}`, err.message);
          return res.status(500).send('Failed to retrieve user profile');
        }
      } else {
        console.log(`✅ User ${userId} found in database: ${user.firstName} ${user.lastName}`);
        
        // Optional: Update user info from external API to keep it fresh
        try {
          const profile = await getUserProfile(userId);
          if (profile) {
            await user.update({
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              orgUnit: profile.orgUnit,
              band: profile.band
            });
            console.log(`🔄 Updated user ${userId} with latest profile data`);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to update user profile for ${userId}, continuing with existing data:`, err.message);
          // Continue with existing user data - don't fail the login
        }
      }

      // Get the return URL from the session
      const returnTo = req.session.returnTo || `${process.env.FRONT_END_URL}`;
      delete req.session.returnTo; // Clean up

      console.log(`🎉 Redirecting authenticated user to: ${returnTo}`);
      res.redirect(returnTo);

    } catch (err) {
      console.error('❌ Error handling SAML login:', err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Login failure route
router.get('/login/fail', (req, res) => {
  console.error("❌ SAML authentication failed");
  res.status(401).send('Login failed. Please try again.');
});

// Route to fetch user info - Enhanced to return database user data
router.get('/user-info', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ 
        message: 'User not authenticated. Please log in via SSO.',
        redirect: '/auth/login' 
      });
    }

    const userId = req.user.nameID;
    
    // Get user data from database (more complete than SAML data)
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
      console.warn(`⚠️ User ${userId} not found in database during user-info request`);
      return res.status(404).json({
        message: 'User profile not found',
        redirect: '/auth/login',
      });
    }

    const userInfo = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    res.json(userInfo);
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    res.status(500).json({
      message: 'Error retrieving user information',
    });
  }
});

router.get("/debug-session", async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    const userId = req.user?.nameID;
    
    let dbUser = null;
    if (isAuthenticated && userId) {
      dbUser = await User.findOne({ where: { userId } });
    }

    // Sanitize session data for debugging - don't expose all data in production
    const sanitizedSession = { 
      authenticated: isAuthenticated,
      userId: userId || 'Not authenticated',
      userExists: !!dbUser,
      userInfo: dbUser ? {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
      } : null,
    };

    res.json({ session: sanitizedSession });
  } catch (err) {
    console.error('❌ Error in debug session:', err);
    res.status(500).json({ error: 'Error retrieving session info' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  const userId = req.user?.nameID || 'Unknown';
  
  req.logout(function(err) {
    if (err) { 
      console.error('❌ Error during logout:', err);
      return res.status(500).send('Error during logout');
    }
    
    console.log(`👋 User ${userId} logged out successfully`);
    res.redirect(`${process.env.FRONT_END_URL}`);
  });
});

export default router;