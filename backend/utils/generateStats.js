// utils/generateStats.js
import { Response, Content, Statement, Behaviour, Skill } from "../models/index.js";

export const generateStats = async (assessmentId) => {
  console.log('Assessment ID:', assessmentId);
  
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

  console.log('Found responses:', responses.length);
  console.log('First response:', responses[0] ? {
    id: responses[0].id,
    score: responses[0].score,
    statement: responses[0].Statement ? 'exists' : 'missing',
    content: responses[0].Statement?.Content ? 'exists' : 'missing',
    behaviour: responses[0].Statement?.Content?.Behaviour ? 'exists' : 'missing',
    skill: responses[0].Statement?.Content?.Behaviour?.Skill ? 'exists' : 'missing'
  } : 'No responses found');

  const behaviourScores = {};
  const skillScores = {};
  const contentScores = {};

  responses.forEach(response => {
    const content = response.Statement?.Content;
    const behaviour = content?.Behaviour;
    const skill = behaviour?.Skill;

    if (behaviour) {
      if (!behaviourScores[behaviour.id]) {
        behaviourScores[behaviour.id] = {
          behaviourId: behaviour.id,
          behaviourName: behaviour.name,
          scores: [],
        };
      }
      behaviourScores[behaviour.id].scores.push(response.score);
    }

    if (skill) {
      if (!skillScores[skill.id]) {
        skillScores[skill.id] = {
          skillId: skill.id,
          skillName: skill.name,
          description: skill.description || '',
          scores: [],
        };
      }
      skillScores[skill.id].scores.push(response.score);
    }

    if (content) {
      if (!contentScores[content.id]) {
        contentScores[content.id] = {
          contentId: content.id,
          title: content.title,
          scores: [],
        };
      }
      contentScores[content.id].scores.push(response.score);
    }
  });

  const getAvg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const behaviourAverages = Object.values(behaviourScores).map(b => ({
    behaviourId: b.behaviourId,
    behaviourName: b.behaviourName,
    averageScore: getAvg(b.scores),
    skillId: responses.find(
      r => r.Statement?.Content?.Behaviour?.id === b.behaviourId
    )?.Statement?.Content?.Behaviour?.Skill?.id,
  }));

  const skillAverages = Object.values(skillScores).map(s => ({
    skillId: s.skillId,
    skillName: s.skillName,
    description: s.description,
    averageScore: getAvg(s.scores),
  }));

  const contentAverages = Object.values(contentScores).map(c => ({
    contentId: c.contentId,
    title: c.title,
    averageScore: getAvg(c.scores),
  }));

  return { behaviourAverages, skillAverages, contentAverages };
};
