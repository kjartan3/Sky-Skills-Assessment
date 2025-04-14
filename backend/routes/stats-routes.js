// routes/stats-route.js

import express from 'express';
import { Assessment, Response, Statement, Behaviour, Skill } from '../models/index.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

// GET /stats/:assessmentId
router.get('/:assessmentId', async (req, res) => {
  const { assessmentId } = req.params;

  try {
    // Fetch responses for this assessment with related statement, behaviour, and skill
    const responses = await Response.findAll({
      where: { assessmentId },
      include: {
        model: Statement,
        include: {
          model: Behaviour,
          include: Skill,
        },
      },
    });

    // Group scores by behaviourId and skillId
    const behaviourScores = {};
    const skillScores = {};

    responses.forEach(response => {
      const behaviour = response.Statement.Behaviour;
      const skill = behaviour.Skill;

      // Group by behaviour
      if (!behaviourScores[behaviour.id]) {
        behaviourScores[behaviour.id] = {
          behaviourId: behaviour.id,
          behaviourName: behaviour.name,
          scores: [],
        };
      }
      behaviourScores[behaviour.id].scores.push(response.score);

      // Group by skill
      if (!skillScores[skill.id]) {
        skillScores[skill.id] = {
          skillId: skill.id,
          skillName: skill.name,
          scores: [],
        };
      }
      skillScores[skill.id].scores.push(response.score);
    });

    // Calculate averages
    const behaviourAverages = Object.values(behaviourScores).map(b => ({
      behaviourId: b.behaviourId,
      behaviourName: b.behaviourName,
      averageScore: b.scores.reduce((a, b) => a + b, 0) / b.scores.length,
    }));

    const skillAverages = Object.values(skillScores).map(s => ({
      skillId: s.skillId,
      skillName: s.skillName,
      averageScore: s.scores.reduce((a, b) => a + b, 0) / s.scores.length,
    }));

    res.json({ behaviourAverages, skillAverages });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
