import express from 'express';
import {
  Assessment,
  Response,
  Statement,
  Content,
  Behaviour,
  Skill,
} from '../models/index.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Create a new assessment with responses
router.post('/', async (req, res) => {
  const { userId, responses } = req.body;
  try {
      console.log("🔹 Received assessment submission:", req.body);

      if (!userId) throw new Error("❌ Missing userId in request");

      const assessment = await Assessment.create({ userId });
      console.log("✅ Created Assessment:", assessment); // ✅ Log the returned object

      const responseData = responses.map((r) => ({
          ...r,
          assessmentId: assessment.id, // If `assessment.id` is undefined, this will fail
      }));

      await Response.bulkCreate(responseData);
      console.log("✅ Responses saved successfully!");

      res.status(201).json({ assessmentId: assessment.id });

  } catch (err) {
      console.error("❌ Assessment creation failed:", err.stack);
      res.status(500).json({ error: "Error creating assessment", details: err.message });
  }
});



router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const assessments = await Assessment.findAll({
      where: { userId },
      include: [
        {
          model: Response,
          attributes: ['statementId', 'score'],
          include: [
            {
              model: Statement,
              attributes: ['id', 'text'],
              include: [
                {
                  model: Content,
                  attributes: ['id', 'title', 'description', 'learningLinks'],
                  include: [
                    {
                      model: Behaviour,
                      attributes: ['id', 'name'],
                      include: [
                        {
                          model: Skill,
                          attributes: ['id', 'name'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
 
    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error finding assessments' });
  }
});



export default router;
