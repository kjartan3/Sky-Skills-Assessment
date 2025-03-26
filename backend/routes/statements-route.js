import express from "express";
import Statement from '../models/statements.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const statements = await Statement.findAll();
        res.json(statements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:skillName', async(req, res) => {
    const {skillName} = req.params;
    try {
        const skill = await Skill.findOne({ where: {name: skillName} });
        if (!skill) { 
            return res.status(404).json({ message: 'Skill not found' });
        }
        const {statements} = await Statement.findAll({ where: {skillId: skill.id} });
        if (statements.length === 0) {
            return res.status(404).json({ message: 'Statements not found' });
        }
        res.json(statements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;