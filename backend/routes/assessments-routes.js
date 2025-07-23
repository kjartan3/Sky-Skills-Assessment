import express from 'express';
import {
  Assessment,
  Response,
  Statement,
  Content,
  Behaviour,
  Skill,
  User
} from '../models/index.js';
import { generateStats } from '../utils/generateStats.js';


const router = express.Router();

// Create a new assessment with responses
router.post('/', async (req, res) => {
  const { userId, responses } = req.body;
  try {
      console.log("🔹 Received assessment submission:", req.body);

      if (!userId) throw new Error("❌ Missing userId in request");

      const assessment = await Assessment.create({ userId });
      console.log("✅ Created Assessment:", assessment); 

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

router.get('/latest-summary', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(`🔹 Found ${users.length} users in database.`);

    const summary = [];

    for (const user of users) {
      try {
        console.log(`\n📁 Checking user: ${user.userId} (${user.firstName} ${user.lastName})`);

        const latestAssessment = await Assessment.findOne({
          where: { userId: user.userId },
          order: [['createdAt', 'DESC']],
        });

        if (!latestAssessment) {
          console.log(`⚠️ No assessments found for user ${user.userId}`);
          continue;
        }

        console.log(`✅ Latest assessment ID: ${latestAssessment.id}`);

        const stats = await generateStats(latestAssessment.id);

        const hasScores =
          stats.behaviourAverages.length > 0 ||
          stats.skillAverages.length > 0 ||
          stats.contentAverages.length > 0;

        if (!hasScores) {
          console.log(`⚠️ No response data or averages found for assessment ${latestAssessment.id}`);
          continue;
        }

        summary.push({
          userId: user.userId,
          orgUnit: user.orgUnit || 'Unknown',
          behaviourAverages: stats.behaviourAverages,
          skillAverages: stats.skillAverages,
          contentAverages: stats.contentAverages,
        });

        console.log(`📊 Summary added for user ${user.userId}`);

      } catch (innerErr) {
        console.error(`❌ Error processing user ${user.userId}:`, innerErr.message);
        continue; // skip this user but continue processing others
      }
    }

    console.log(`\n✅ Finished processing. Returning summary for ${summary.length} users.`);
    res.json(summary);

  } catch (err) {
    console.error('❌ Summary generation failed:', err.message);
    res.status(500).json({ error: 'Failed to generate latest summary', details: err.message });
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
                          attributes: ['id', 'name', 'description'],
                          required: true,
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

// POST /bulk-assessments
router.post('/bulk-assessments', async (req, res) => {
  const { userIds } = req.body;

  console.log('Bulk assessments request for users:', userIds);

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Invalid userIds provided' });
  }

  try {
    const users = await User.findAll({
      where: { userId: userIds }
    });

    console.log(`Found ${users.length} users out of ${userIds.length} requested`);

    const results = [];

    for (const user of users) {
      console.log(`Processing user: ${user.userId} (${user.firstName} ${user.lastName})`);

      const assessments = await Assessment.findAll({
        where: { userId: user.userId },
        include: [
          {
            model: Response,
            include: [
              {
                model: Statement,
                include: {
                  model: Content,
                  include: {
                    model: Behaviour,
                    include: Skill,
                  },
                },
              },
            ],
          },
        ],
        order: [['createdAt', 'ASC']],
      });

      console.log(`Found ${assessments.length} assessments for user ${user.userId}`);

      const enrichedAssessments = await Promise.all(
        assessments.map(async (assessment) => {
          try {
            const stats = await generateStats(assessment.id);
            return {
              ...assessment.toJSON(),
              stats,
            };
          } catch (error) {
            console.error(`Error generating stats for assessment ${assessment.id}:`, error.message);
            return {
              ...assessment.toJSON(),
              stats: null,
            };
          }
        })
      );

      results.push({
        user: {
          id: user.id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          orgUnit: user.orgUnit,
          band: user.band,
        },
        assessments: enrichedAssessments,
      });
    }

    console.log(`Returning data for ${results.length} users`);
    res.json(results);

  } catch (err) {
    console.error('Error in bulk fetch:', err);
    res.status(500).json({
      error: 'Failed to fetch bulk assessments',
      details: err.message
    });
  }
});




export default router;