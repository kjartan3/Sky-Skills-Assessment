import {User} from "../../models"


describe('User model', () => {
    it('should return a user', async () => {
      const user = await User.findByPk(1);
      expect(user).not.toBeNull();
      expect(user.name).toBe("Jane Doe");
      
    });
  
    
  });
  