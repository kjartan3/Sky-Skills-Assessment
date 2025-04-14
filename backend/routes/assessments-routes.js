// routes/assessments-route.js
import express from 'express';
import { Assessment, Response } from '../models/index.js';

const router = express.Router();

// Create a new assessment with responses
router.post('/', async (req, res) => {
  const { userId, responses } = req.body;
  try {
    const assessment = await Assessment.create({ userId });
    const responseData = responses.map((r) => ({
      ...r,
      assessmentId: assessment.id,
    }));
    await Response.bulkCreate(responseData);
    res.status(201).json({ assessmentId: assessment.id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating assessment' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const assessments = await Assessment.findAll({
      where: { userId: userId } // or just { userId }
    });

    res.json(assessments);

  } catch (err) {
    console.error(err); // Add this to debug errors in terminal
    res.status(500).json({ error: 'Error finding assessments' });
  }
});



export default router;
