// utils/generateStats.js
import { Response, Content, Statement, Behaviour, Skill } from "../models/index.js";


export const generateStats = async (assessmentId) => {
  const responses = await Response.findAll({
    where: { assessmentId },
    include: {
      model: Statement,
      include: {
        model: Content,
        include: {
          model: Behaviour,
          include: Skill,
        },
      },
    },
  });

  const behaviourScores = {};
  const skillScores = {};

  responses.forEach(response => {
    const behaviour = response.Statement?.Content?.Behaviour;
    const skill = behaviour?.Skill;

    if (!behaviour) return;

    if (!behaviourScores[behaviour.id]) {
      behaviourScores[behaviour.id] = {
        behaviourId: behaviour.id,
        behaviourName: behaviour.name,
        scores: [],
      };
    }
    behaviourScores[behaviour.id].scores.push(response.score);

    if (!skill) return;

    if (!skillScores[skill.id]) {
      skillScores[skill.id] = {
        skillId: skill.id,
        skillName: skill.name,
        scores: [],
      };
    }
    skillScores[skill.id].scores.push(response.score);
  });

  const behaviourAverages = Object.values(behaviourScores).map(b => {
    return {
      behaviourId: b.behaviourId,
      behaviourName: b.behaviourName,
      averageScore: b.scores.reduce((a, s) => a + s, 0) / b.scores.length,
      skillId: responses.find(
        r => r.Statement?.Content?.Behaviour?.id === b.behaviourId
      )?.Statement?.Content?.Behaviour?.Skill?.id,
    };
  });

  const skillAverages = Object.values(skillScores).map(s => ({
    skillId: s.skillId,
    skillName: s.skillName,
    averageScore: s.scores.reduce((a, s) => a + s, 0) / s.scores.length,
    description: responses.find(
      r => r.Statement?.Content?.Behaviour?.Skill?.id === s.skillId
    )?.Statement?.Content?.Behaviour?.Skill?.description || "No description available",
  }));

  return { behaviourAverages, skillAverages };
};
