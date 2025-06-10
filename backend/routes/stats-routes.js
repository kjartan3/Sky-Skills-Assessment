import express from 'express';
import { Assessment, Response, Statement, Content, Behaviour, Skill } from '../models/index.js';
import { Sequelize } from 'sequelize';
 
const router = express.Router();
 
// GET /stats/:assessmentId
router.get('/:assessmentId', async (req, res) => {
  const { assessmentId } = req.params;
 
  try {
    // Fetch responses for this assessment with the updated nested structure:
    const responses = await Response.findAll({
      where: { assessmentId },
      include: {
        model: Statement,
        include: {
          model: Content,
          include: {
            model: Behaviour,
            include: Skill, // includes the Skill associated with the Behaviour
          },
        },
      },
    });
 
    // Group scores by behaviourId and skillId on the new nesting:
    const behaviourScores = {};
    const skillScores = {};
 
    responses.forEach(response => {
      // Use optional chaining to safely traverse the new nested structure:
      const behaviour = response.Statement?.Content?.Behaviour;
      const skill = behaviour?.Skill;
 
      if (!behaviour) return;
 
      // Group by Behaviour:
      if (!behaviourScores[behaviour.id]) {
        behaviourScores[behaviour.id] = {
          behaviourId: behaviour.id,
          behaviourName: behaviour.name,
          scores: [],
        };
      }
      behaviourScores[behaviour.id].scores.push(response.score);
 
      if (!skill) return;
 
      // Group by Skill:
      if (!skillScores[skill.id]) {
        skillScores[skill.id] = {
          skillId: skill.id,
          skillName: skill.name,
          scores: [],
        };
      }
      skillScores[skill.id].scores.push(response.score);
    });
 
    // Calculate averages for each behaviour and include the skillId
    const behaviourAverages = Object.values(behaviourScores).map(b => {
      // Find the associated skill via the first matching response
      const relatedResponse = responses.find(
        r => r.Statement?.Content?.Behaviour?.id === b.behaviourId
      );
      const skillId = relatedResponse?.Statement?.Content?.Behaviour?.Skill?.id;
      return {
        behaviourId: b.behaviourId,
        behaviourName: b.behaviourName,
        averageScore: b.scores.reduce((a, score) => a + score, 0) / b.scores.length,
        skillId,
      };
    });
 
    // Calculate averages for each skill
   const skillAverages = Object.values(skillScores).map(s => ({
  skillId: s.skillId,
  skillName: s.skillName,
  averageScore: s.scores.reduce((a, score) => a + score, 0) / s.scores.length,
  description: responses.find(r => r.Statement?.Content?.Behaviour?.Skill?.id === s.skillId)?.Statement?.Content?.Behaviour?.Skill?.description || "No description available", // ✅ Include description
}));
 
    res.json({ behaviourAverages, skillAverages });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
 
export default router;
