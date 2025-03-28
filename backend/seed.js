import sequelize from './config/db.js';
import Skill from './models/skills.js'; 
import Behaviour from './models/behaviours.js';
import Statement from './models/statements.js';

const seedDatabase = async () => {
  try {
    // Sync the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Resets the database
    
    // Create Skills in the database
    const skills = await Skill.bulkCreate([
      { name: 'Creative' },
      { name: 'Communication' },
      { name: 'Adaptability' },
      { name: 'Do the right thing' },
    ]);

    // Create Statements for each Skill
    const statements = [
      { text: 'I can break down complex problems into manageable parts.', skillId: skills[0].id },
      { text: 'I communicate my ideas clearly in a team.', skillId: skills[1].id },
      { text: 'I adapt quickly to changes in my work.', skillId: skills[2].id },
      { text: 'I actively contribute to team discussions.', skillId: skills[3].id },
      { text: 'I take initiative when leading a project.', skillId: skills[4].id },
    ];

    // Insert Statements into the database
    await Statement.bulkCreate(statements);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();
