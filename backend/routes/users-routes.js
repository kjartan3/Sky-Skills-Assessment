import express from 'express';
import { User } from '../models/index.js';

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
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users', err);

    res.status(500).json({ message: err.message });
  }
})

export default router;
