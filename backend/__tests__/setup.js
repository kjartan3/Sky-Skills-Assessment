// __tests__/setup.js

process.env.NODE_ENV = 'test';


beforeEach(() => {
  jest.clearAllMocks();
});

// ✅ Mock Sequelize models and associations
jest.mock('../models/index.js', () => {
  const mockSkillData = [
    { id: 1, name: 'Welcoming' },
    { id: 2, name: 'Creative' },
    { id: 3, name: 'Simplifying' },
    { id: 4, name: 'Doing the right thing' },
  ];

  const mockBehaviourData = [
    { id: 1, name: 'Be inclusive by nature', skillId: 1 },
    { id: 2, name: 'Play as one team', skillId: 1 },
  ];

  const mockStatementData = [
    { id: 1, text: 'I encourage diverse perspectives in discussions.', behaviourId: 1 },
    { id: 2, text: 'I actively listen to others and ensure everyone feels heard.', behaviourId: 1 },
  ];

  const mockUserData = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };

  const mockAssessmentData = {
    id: 1,
    userId: 1,
  };

  const mockResponseData = [
    { id: 1, assessmentId: 1, statementId: 1, score: 4 },
    { id: 2, assessmentId: 1, statementId: 2, score: 5 },
  ];

  return {
    Skill: {
      findAll: jest.fn(() => Promise.resolve(mockSkillData)),
      create: jest.fn(skill => Promise.resolve({ id: 5, ...skill })),
      bulkCreate: jest.fn(() => Promise.resolve(mockSkillData)),
    },
    Behaviour: {
      findAll: jest.fn(() => Promise.resolve(mockBehaviourData)),
      bulkCreate: jest.fn(() => Promise.resolve(mockBehaviourData)),
    },
    Statement: {
      findAll: jest.fn(() => Promise.resolve(mockStatementData)),
      bulkCreate: jest.fn(() => Promise.resolve(mockStatementData)),
    },
    User: {
      findByPk: jest.fn(() => Promise.resolve(mockUserData)),
      create: jest.fn(() => Promise.resolve(mockUserData)),
    },
    Assessment: {
      findAll: jest.fn(() => Promise.resolve([mockAssessmentData])),
      create: jest.fn(() => Promise.resolve(mockAssessmentData)),
    },
    Response: {
      findAll: jest.fn(() => Promise.resolve(mockResponseData)),
      bulkCreate: jest.fn(() => Promise.resolve(mockResponseData)),
    }
  };
});

// ✅ Optional: Global test data
global.testUser = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane.doe@example.com'
};

// ✅ Placeholder test to keep Jest happy
describe('Setup Test', () => {
  it('should pass the setup without any errors', () => {
    expect(true).toBe(true);
  });
});
