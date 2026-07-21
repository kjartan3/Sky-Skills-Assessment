import request from 'supertest';
import app from '../../server.js';
import { Skill } from '../../models';

jest.mock('../../models', () => {
  return {
    Skill: {
      findAll: jest.fn(() => Promise.resolve([
        { id: 1, name: 'Welcoming' },
        { id: 2, name: 'Empathetic Listening' }
      ]))
    }
  };
});

describe('GET /skills', () => {
  it('returns all skills', async () => {
    const res = await request(app).get('/skills');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Welcoming');
    expect(res.body[1].name).toBe('Empathetic Listening');
  });

  it('handles server errors gracefully', async () => {
    Skill.findAll = jest.fn(() => { throw new Error('DB failure') });

    const res = await request(app).get('/skills');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('DB failure');
  });
});
