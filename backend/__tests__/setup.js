import sequelize from '../config/db.js';
import { Skill, Behaviour, User, Assessment, Statement, Response } from '../models/index.js';

// Ensure associations are registered
Skill.hasMany(Behaviour, { foreignKey: 'skillId' });
Behaviour.belongsTo(Skill, { foreignKey: 'skillId' });

Behaviour.hasMany(Statement, { foreignKey: 'behaviourId' });
Statement.belongsTo(Behaviour, { foreignKey: 'behaviourId' });

User.hasMany(Assessment, { foreignKey: 'userId' });
Assessment.belongsTo(User, { foreignKey: 'userId' });

Assessment.hasMany(Response, { foreignKey: 'assessmentId' });
Response.belongsTo(Assessment, { foreignKey: 'assessmentId' });

Statement.hasMany(Response, { foreignKey: 'statementId' });
Response.belongsTo(Statement, { foreignKey: 'statementId' });

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recreate tables before tests

  // Optional: Seed test data here
  const skills = await Skill.bulkCreate([
    { name: 'Welcoming' },
    { name: 'Creative' },
    { name: 'Simplifying' },
    { name: 'Doing the right thing' },
  ]);

  const behaviours = await Behaviour.bulkCreate([
    { name: 'Be inclusive by nature', skillId: skills[0].id },
    { name: 'Play as one team', skillId: skills[0].id },
  ]);

  const statements = [
    { text: 'I encourage diverse perspectives in discussions.', behaviourId: behaviours[0].id },
    { text: 'I actively listen to others and ensure everyone feels heard.', behaviourId: behaviours[0].id },
  ];

  await Statement.bulkCreate(statements);

  await User.create({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    userId: 1,
  });
});

afterAll(async () => {
  await sequelize.close(); // Close connection after all tests
});

// Placeholder test
describe('Setup Test', () => {
  it('should pass the setup without any errors', () => {
    expect(true).toBe(true); // Placeholder test to avoid Jest errors
  });
});
