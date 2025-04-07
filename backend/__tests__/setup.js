import sequelize from '../config/db.js';
import { Skill, Behaviour, Statement } from '../models/index.js';

// Ensure associations are registered
Skill.hasMany(Behaviour, { foreignKey: 'skillId' });
Behaviour.belongsTo(Skill, { foreignKey: 'skillId' });

Behaviour.hasMany(Statement, { foreignKey: 'behaviourId' });
Statement.belongsTo(Behaviour, { foreignKey: 'behaviourId' });

beforeAll(async () => {
  await sequelize.sync({ force: true }); // recreate tables before tests
});

beforeEach(async () => {
  // Optional: Seed test data here
  const skill = await Skill.create({ name: 'Communication' });
  const behaviour = await Behaviour.create({ name: 'Active listening', skillId: skill.id });
  await Statement.create({ text: 'Paraphrases key points to confirm understanding', behaviourId: behaviour.id });
});

afterAll(async () => {
  await sequelize.close(); // Close connection after all tests are done
});

// Add a placeholder test to avoid Jest errors
describe('Setup Test', () => {
  it('should pass the setup without any errors', () => {
    expect(true).toBe(true); // Placeholder test
  });
});
