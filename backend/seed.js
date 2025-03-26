import sequelize from './config/db.js'; // Import sequelize configuration
import Skill from './models/skills.js'; // Import the Skill model
import Statement from './models/statements.js'; // Import the Statement model

const seedDatabase = async () => {
  try {
    // Sync the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Resets the database
    
    // Create skills in the database
    const skills = await Skill.bulkCreate([
      { name: 'Problem-Solving' },
      { name: 'Communication' },
      { name: 'Adaptability' },
      { name: 'Collaboration' },
      { name: 'Leadership' },
    ]);

    // Create questions for each skill
    const statements = [
      { text: 'I can break down complex problems into manageable parts.', skillId: skills[0].id },
      { text: 'I communicate my ideas clearly in a team.', skillId: skills[1].id },
      { text: 'I adapt quickly to changes in my work.', skillId: skills[2].id },
      { text: 'I actively contribute to team discussions.', skillId: skills[3].id },
      { text: 'I take initiative when leading a project.', skillId: skills[4].id },
    ];

    // Insert questions into the database
    await Statement.bulkCreate(statements);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();
