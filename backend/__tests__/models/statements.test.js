import { Statement, Skill, Behaviour } from "../../models";

describe('Statement model', () => {
  it('should create a statement linked to a behaviour', async () => {
    const skill = await Skill.create({ name: 'Empathy' });
    const behaviour = await Behaviour.create({ name: 'Considers others’ feelings', skillId: skill.id });
    const statement = await Statement.create({ text: 'Asks open-ended questions', behaviourId: behaviour.id });

    const found = await statement.getBehaviour();
    expect(found).toBeDefined();
    expect(found.name).toBe('Considers others’ feelings');
  });

  
});
