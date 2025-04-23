import express from "express"
import { User } from '../models/index.js';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email }});
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use"});
        }

        const newUser = await User.create({ name, email,   passwordHash: password})
        const token = jwt.sign(
            { userId: newUser.userId, email: newUser.email},
            SECRET_KEY, { expiresIn: '2h' });

        res.status(201).json({ token });
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
            return res.status(401).json({ message: "Invalid credentials"});
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email},
            SECRET_KEY, { expiresIn: '2h' });

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
        const user = await User.findByPk({
            where: {userId: decoded.userId},
            attributes: { exclude: ['passwordHash']}
                })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user)
    } catch(error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token"});
    }
})

export default router;
