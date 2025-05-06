# Sky-Skills-Assessment

# 🔐 SAML SSO Integration – Skills Assessment App

This document explains how SAML 2.0 Single Sign-On (SSO) is implemented in the Skills Assessment Application using `passport-saml`. It covers backend setup, session management, frontend behavior, and useful debugging tools.

---

## 📁 Project Structure Overview



/backend
├── server.js # Express HTTPS server with session and passport
├── saml-auth.js # SAML strategy configuration
├── routes/
│ └── auth-routes.js # SSO login/logout/callback/session routes
└── models/User.js # Sequelize user model

/frontend
├── src/
│ ├── App.js / Home.js # Uses SSO session, redirects to login if needed
└── .env # Contains REACT_APP_API_URL

---

## ⚙️ Environment Configuration

Add the following variables to your `.env`:

```env
# SAML
SAML_SSO_URL=https://your-idp.example.com/sso
SAML_ENTITY_ID=skills-assessment-app
SAML_X509_CERTIFICATE="-----BEGIN CERTIFICATE-----MIID...==-----END CERTIFICATE-----"
CALLBACK_URL=https://your-backend.example.com/auth/login/callback

# Session
SESSION_SECRET=your-super-secret-key


🔧 Backend Authentication Flow
1. Passport-SAML Configuration (saml-auth.js)

    Configures the SamlStrategy with strict security defaults

    Parses and validates incoming SAML assertions

    Logs and stores basic user data (e.g. nameID, email)

    Note: The certificate is automatically formatted to ensure line breaks are correct.

    {
  "nameID": "user@company.com",
  "email": "user@company.com",
  "issuer": "https://idp.company.com"
}

🛣️ Express Routes (auth-routes.js)

| Route  | Method |  Purpose |
| ------------- | ------------- |
| /auth/login  | Get | Initiates SSO redirect to IdP |
| /auth/login/callback	| POST | Receives and handles SAML response |
| /auth/user-info |	GET | Returns session-based user info |
| /auth/login/fail | GET | Redirect on login failure |
| /auth/logout | GET | Logs out from session |
| /auth/debug-session |	GET | (Dev) Inspects session object |


🔐 Session Setup (server.js)
Session Cookie Config:
```
cookie: {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
  maxAge: 1000 * 60 * 60 // 1 hour
}
```

Ensure the following:

- App is served over HTTPS

- Cookies are allowed cross-origin (sameSite: 'none')

- Frontend sets credentials: 'include' on fetch requests

    ----

    🔗 Frontend Behavior (React)
Session Detection and Login Redirect

```
useEffect(() => {
      const fetchUserInfo = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/user-info`, {
                  credentials: 'include',
                  headers: {
                      'Accept': 'application/json'
                  }
              });
              
              if (response.ok) {
                  const userData = await response.json();
                  setUser(userData);
              } else {
                  // Clear user state if unauthorized
                  setUser(null);
              }
          } catch (error) {
              console.error('Error fetching user info:', error);
              setUser(null);
          } finally {
              setIsLoading(false);
          }
      };
      
      fetchUserInfo();
  }, []);
  ```

  Make sure REACT_APP_API_URL points to the backend HTTPS domain.

  🧾 Metadata Endpoint

Your app exposes SAML metadata at:

GET /metadata

Response is in XML format. Share this with your Identity Provider (IdP) to register your service.

✅ Final Setup Checklist

- Backend served via HTTPS with valid SSL certs

- express-session set up with secure cookie config

- Passport SAML strategy configured correctly

- React fetches use credentials: 'include'

- Session persists between login and frontend usage

- User creation/lookup is handled in callback


 Useful Tips

- You can customize passport.serializeUser to include more attributes (e.g. displayName, roles)

- Store and display SAML errors only during development

- Log profile in the callback to inspect attribute mapping

- For company-wide use: configure logout to federate back to the IdP logout endpoint