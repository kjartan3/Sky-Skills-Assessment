const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) { // ✅ Checks if user data is stored in session
        return next();
    } else {
        console.log("❌ Authentication failed: No session user found");
        res.status(401).json({ message: 'Unauthorized. Please log in via SSO.' });
    }
};


export default requireAuth;
