import { Response, Statement, Content, Behaviour, Skill, Assessment } from "../models/index.js";

export const generateOrgStats = async (assessmentIds) => {
 const allResponses = await Response.findAll({
  where: { assessmentId: assessmentIds },
  include: [
    {
      model: Statement,
      include: {
        model: Content,
        include: {
          model: Behaviour,
          include: Skill,
        },
      },
    },
    {
      model: Assessment // this unlocks response.Assessment.userId
    }
  ]
});
  const userBehaviourScores = {};
  const userSkillScores = {};
  const userContentScores = {};

  allResponses.forEach(response => {
    const userId = response.Assessment?.userId;
    const content = response.Statement?.Content;
    const behaviour = content?.Behaviour;
    const skill = behaviour?.Skill;

    if (!userId || !content || !behaviour || !skill) return;

    // 🧠 Behaviours
    const behaviourKey = behaviour.id;
    if (!userBehaviourScores[userId]) userBehaviourScores[userId] = {};
    if (!userBehaviourScores[userId][behaviourKey]) {
      userBehaviourScores[userId][behaviourKey] = {
        behaviourName: behaviour.name,
        scores: [],
      };
    }
    userBehaviourScores[userId][behaviourKey].scores.push(response.score);

    // 🎯 Skills
    const skillKey = skill.id;
    if (!userSkillScores[userId]) userSkillScores[userId] = {};
    if (!userSkillScores[userId][skillKey]) {
      userSkillScores[userId][skillKey] = {
        skillName: skill.name,
        description: skill.description || '',
        scores: [],
      };
    }
    userSkillScores[userId][skillKey].scores.push(response.score);

    // 📚 Content
    const contentKey = content.id;
    if (!userContentScores[userId]) userContentScores[userId] = {};
    if (!userContentScores[userId][contentKey]) {
      userContentScores[userId][contentKey] = {
        title: content.title,
        scores: [],
      };
    }
    userContentScores[userId][contentKey].scores.push(response.score);
  });

  // Helper: reduce array
  const getAvg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const aggregate = (userMap) => {
    const perItemAverages = {}; // itemId → [user-level averages]

    Object.values(userMap).forEach(items => {
      Object.entries(items).forEach(([id, data]) => {
        const avg = getAvg(data.scores);
        if (!perItemAverages[id]) {
          perItemAverages[id] = {
            name: data.behaviourName || data.skillName || data.title,
            description: data.description || '',
            userScores: [],
          };
        }
        perItemAverages[id].userScores.push(avg);
      });
    });

    return Object.entries(perItemAverages).map(([id, data]) => ({
      id,
      name: data.name,
      description: data.description,
      averageScore: getAvg(data.userScores),
    }));
  };

  const orgBehaviourAverages = aggregate(userBehaviourScores);
  const orgSkillAverages = aggregate(userSkillScores);
  const orgContentAverages = aggregate(userContentScores);

  return { orgBehaviourAverages, orgSkillAverages, orgContentAverages };
};
