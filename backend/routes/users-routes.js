import express from 'express';
import { User } from '../models/index.js';
import { getUserTest } from '../utils/fetchUserProfile.js';
import { Sequelize, Op } from 'sequelize';


const router = express.Router();

// Create or fetch existing user by external ID (from the learning platform)
router.post('/', async (req, res) => {
  const { userId, firstName, lastName, email } = req.body;
  try {
    const [user, created] = await User.findOrCreate({
      where: { userId },
      defaults: { firstName, lastName, email },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error finding or creating user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['firstName', 'ASC']] });
    
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users', err);

    res.status(500).json({ message: err.message });
  }
})

router.get('/org-units', async (req, res) => {
  try {
    const units = await User.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('orgUnit')), 'orgUnit']
      ],
      where: {
        orgUnit: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    const unitList = units.map(u => u.orgUnit);
    res.json(unitList);
  } catch (err) {
    console.error('❌ Error fetching org units:', err.message);
    res.status(500).json({ error: 'Failed to retrieve org units' });
  }
});

router.get('/by-org', async (req, res) => {
  const { unit } = req.query;

  if (!unit) {
    return res.status(400).json({ error: 'Missing orgUnit in query' });
  }

  try {
    const users = await User.findAll({
      where: { orgUnit: unit }
    });

    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users by org unit:', err.message);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

router.get("/test", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  try {
    const userData = await getUserTest(userId);
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data", details: err.message });
  }
});

export default router;
