import request from 'supertest';
import app from '../../server.js';
import { Statement, Behaviour, Content } from '../../models';

jest.mock('../../models', () => {
  const mockSkill = { id: 1, name: 'Welcoming' };
  const mockBehaviour = { id: 1, name: 'Be inclusive by nature', skill: mockSkill };
  const mockContent = {
    id: 1,
    title: 'Inclusive Leadership',
    description: 'Learn how to lead inclusively',
    learningLinks: ['https://example.com'],
    behaviour: mockBehaviour
  };

  const mockStatements = [
    {
      id: 1,
      text: 'I encourage diverse perspectives.',
      guidanceText: 'Make space for all voices.',
      contentId: 1,
      content: mockContent
    },
    {
      id: 2,
      text: 'I actively listen to others.',
      guidanceText: 'Practice empathy.',
      contentId: 1,
      content: mockContent
    }
  ];

  return {
    Statement: {
      findAll: jest.fn(() => Promise.resolve(mockStatements))
    },
    Behaviour: {
      findOne: jest.fn(({ where }) => {
        if (where.name === 'Be inclusive by nature') {
          return Promise.resolve({ id: 1, name: 'Be inclusive by nature' });
        }
        return Promise.resolve(null);
      })
    },
    Content: {},
    Skill: {}
  };
});

describe('GET /statements', () => {
  it('returns all statements with nested content and behaviour', async () => {
    const res = await request(app).get('/statements');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].text).toBe('I encourage diverse perspectives.');
    expect(res.body[0].content.title).toBe('Inclusive Leadership');
    expect(res.body[0].content.behaviour.name).toBe('Be inclusive by nature');
  });
});

describe('GET /statements/:behaviourName', () => {
  it('returns statements for a valid behaviour name', async () => {
    // Override Statement.findAll for this test
    Statement.findAll = jest.fn(() => Promise.resolve([
      { id: 1, text: 'I encourage diverse perspectives.', behaviourId: 1 }
    ]));

    const res = await request(app).get('/statements/Be inclusive by nature');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].text).toContain('diverse perspectives');
  });

  it('returns 404 if behaviour is not found', async () => {
    const res = await request(app).get('/statements/NonexistentBehaviour');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Behaviour not found');
  });

  it('returns 404 if no statements found for behaviour', async () => {
    Behaviour.findOne = jest.fn(() => Promise.resolve({ id: 2, name: 'EmptyBehaviour' }));
    Statement.findAll = jest.fn(() => Promise.resolve([]));

    const res = await request(app).get('/statements/EmptyBehaviour');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Statements not found for this behaviour');
  });
});
