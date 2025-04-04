import express from "express";
import {Skill} from '../models/index.js';


const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const skills = await Skill.findAll();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;