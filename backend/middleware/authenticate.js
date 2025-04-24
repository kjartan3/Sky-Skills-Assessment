import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const SECRET_KEY = process.env.JWT_SECRET

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: "No token provided"})
    } 
    const token = authHeader.split(' ')[1]
    try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const user = await User.findByPk(decoded.id, {
                attributes: {exclude: ['passwordHash']},
            })
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next()
        } catch(error) {
            console.error(error);
            res.status(401).json({ message: "Invalid token"});
        }
}

export default authenticate