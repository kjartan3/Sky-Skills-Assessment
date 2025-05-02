import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';
import dotenv from 'dotenv';
dotenv.config();

const samlConfig = {
    entryPoint: process.env.SAML_SSO_URL,
    issuer: process.env.SAML_ENTITY_ID,
    cert: process.env.SAML_X509_CERTIFICATE,
    callbackUrl: process.env.CALLBACK_URL,
    signatureAlgorithm: "sha256"
};

passport.use(new SamlStrategy(samlConfig, (profile, done) => {
    try {
        console.log("SAML Strategy Executed!");
        console.log('SAML Profile:', profile); // Debugging user attributes
        return done(null, profile); // Return the user profile to be stored in session
    } catch (error) {
        console.error('SAML error:', error);
        return done(error);
    }
}));

// Serialize the user object into the session
passport.serializeUser((user, done) => {
    done(null, user); // You can customize what gets stored in the session
});

// Deserialize the user object from the session
passport.deserializeUser((user, done) => {
    done(null, user); // Retrieve the user object for further use
});

export default passport;
