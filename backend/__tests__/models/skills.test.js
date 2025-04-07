import { Skill } from "../../models";

describe('Skill model', () => {
  it('should create a skill successfully', async () => {
    const skill = await Skill.create({ name: 'Teamwork' });
    expect(skill).toBeDefined();
    expect(skill.name).toBe('Teamwork');
  });

  it('should not allow null name', async () => {
    await expect(Skill.create({})).rejects.toThrow();
  });
});
