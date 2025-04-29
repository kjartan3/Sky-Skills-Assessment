// routes/assessments-route.js
import express from 'express';
import { Assessment, Response, Statement } from '../models/index.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Create a new assessment with responses
router.post('/',requireAuth, async (req, res) => {
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

router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;

  try {
    const assessments = await Assessment.findAll({
      where: { userId },
      include: [
        {
          model: Response,
          include: [
            {
              model: Statement, // Optional: include Statement text
              attributes: ['text', 'behaviourId']
            }
          ],
          attributes: ['statementId', 'score']
        }
      ],
      order: [
        ["createdAt", "DESC"],
      ]
    });

    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error finding assessments' });
  }
});



export default router;
