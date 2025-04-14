import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

// Create or fetch existing user by external ID (from the learning platform)
router.post('/', async (req, res) => {
  const { userId, name } = req.body;
  try {
    const [user, created] = await User.findOrCreate({
      where: { userId },
      defaults: { name },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error finding or creating user' });
  }
});

export default router;
