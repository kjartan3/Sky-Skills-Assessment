import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';
import dotenv from 'dotenv';
dotenv.config();

// Enhanced SAML configuration
// Update the samlConfig in your saml-auth.js file
const samlConfig = {
    entryPoint: process.env.SAML_SSO_URL,
    issuer: process.env.SAML_ENTITY_ID,
    // Format the certificate with proper line breaks
    cert: process.env.SAML_X509_CERTIFICATE
        .replace('-----BEGIN CERTIFICATE-----', '-----BEGIN CERTIFICATE-----\n')
        .replace('-----END CERTIFICATE-----', '\n-----END CERTIFICATE-----')
        .replace(/(.{64})/g, '$1\n'),
    callbackUrl: process.env.CALLBACK_URL,
    signatureAlgorithm: "sha256",
    forceAuthn: false,
    validateInResponseTo: false,
    identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    acceptedClockSkewMs: 5000,
    disableRequestedAuthnContext: true
};


passport.use(new SamlStrategy(samlConfig, (profile, done) => {
    try {
        console.log("SAML Strategy Executed!");
        console.log('SAML Profile:', profile); // Debugging user attributes
        
        // Basic validation of the profile
        if (!profile || !profile.nameID) {
            console.error('Invalid SAML profile received');
            return done(new Error('Invalid SAML profile'));
        }
        
        return done(null, profile); // Return the user profile to be stored in session
    } catch (error) {
        console.error('SAML error:', error);
        return done(error);
    }
}));

// Serialize the user object into the session
passport.serializeUser((user, done) => {
    // Store only necessary user information
    const serializedUser = {
        nameID: user.nameID,
        email: user.email || null,
        // Add any other properties you need
    };
    done(null, serializedUser);
});

// Deserialize the user object from the session
passport.deserializeUser((user, done) => {
    // No need to fetch from database here since we stored what we need in the session
    done(null, user);
});

export default passport;