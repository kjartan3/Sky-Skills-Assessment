import { Skill, Behaviour, Statement } from "../../models";

describe("Skill model", () => {
    it('should retrieve a skill and its associated behaviours and statements', async () => {
        const skill = await Skill.findByPk(1, {
          include: {
            model: Behaviour,
            include: {
              model: Statement,
            },
          },
        });
      
        console.log(skill); // Log the retrieved skill for debugging
      
        expect(skill).not.toBeNull();
        expect(skill.Behaviours).not.toBeUndefined();
        expect(skill.Behaviours.length).toBeGreaterThan(0);
      
        const firstBehaviour = skill.Behaviours[0];
        console.log(firstBehaviour.Statements); // Log associated statements for debugging
      
        expect(firstBehaviour.Statements).not.toBeUndefined();
        expect(firstBehaviour.Statements.length).toBeGreaterThan(0);
      });
      
});
