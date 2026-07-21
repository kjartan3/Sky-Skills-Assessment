import request from 'supertest';
import app from '../../server.js';
import { Behaviour } from '../../models';

jest.mock('../../models', () => {
  const mockBehaviours = [
    { id: 1, name: 'Be inclusive by nature' },
    { id: 2, name: 'Lead with empathy' }
  ];

  return {
    Behaviour: {
      findAll: jest.fn(() => Promise.resolve(mockBehaviours)),
      findByPk: jest.fn((id) => {
        const found = mockBehaviours.find(b => b.id === parseInt(id));
        return Promise.resolve(found || null);
      })
    }
  };
});

describe('GET /behaviours', () => {
  it('returns all behaviours', async () => {
    const res = await request(app).get('/behaviours');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Be inclusive by nature');
  });
});

describe('GET /behaviours/:behaviourId', () => {
  it('returns a behaviour by ID', async () => {
    const res = await request(app).get('/behaviours/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Be inclusive by nature');
  });

  it('returns 404 if behaviour not found', async () => {
    const res = await request(app).get('/behaviours/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Behaviour not found');
  });
});
