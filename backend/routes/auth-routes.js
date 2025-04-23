const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/index.js');
const SECRET_KEY = process.env.JWT_SECRET

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email }});
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use"});
        }

        const newUser = await User.create({ email, passwordHash: password})
        res.status(201).json({ message: "User created"});
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }});

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ message: "Wrong credentials"});
        }

        const token = jwt.sign({ id: user.id, email: user.email}, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token })
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: "No token provided"})
    } 

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id, { attributes: { excludes: ['passwordHash'] } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user)
    } catch(error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token"});
    }
})

module.exports = router;
