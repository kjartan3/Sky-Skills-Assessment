import sequelize from './config/database.js';
import Skill from './models/skills.model.js';
import Question from './models/questions.model.js';
 
const seedDatabase = async () => {

  await sequelize.sync({ force: true }); // Resets database
 
  const skills = await Skill.bulkCreate([

    { name: 'Problem-Solving' },

    { name: 'Communication' },

    { name: 'Adaptability' },

    { name: 'Collaboration' },

    { name: 'Leadership' },

  ]);
 
  const questions = [

    { text: 'I can break down complex problems into manageable parts.', skillId: skills[0].id },

    { text: 'I communicate my ideas clearly in a team.', skillId: skills[1].id },

    { text: 'I adapt quickly to changes in my work.', skillId: skills[2].id },

    { text: 'I actively contribute to team discussions.', skillId: skills[3].id },

    { text: 'I take initiative when leading a project.', skillId: skills[4].id },

  ];
 
  await Question.bulkCreate(questions);

  console.log('Database seeded!');

};
 
seedDatabase();

 