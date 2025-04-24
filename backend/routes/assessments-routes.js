// routes/assessments-route.js
import express from 'express';
import { Assessment, Response, Statement } from '../models/index.js';
import authenticate from '../middleware/authenticate.js';


const router = express.Router();

// Create a new assessment with responses
router.post('/', authenticate, async (req, res) => {
  
  
    try {
      
      const userId = req.user.id
      const { responses } = req.body
      

      const assessment = await Assessment.create({ userId });
      const responseData = responses.map((r) => ({
        ...r,
        assessmentId: assessment.id
      }));

      await Response.bulkCreate(responseData);

      res.status(201).json({ assessmentId: assessment.id })
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating assessment'})
    }
});

router.get('/', authenticate, async (req, res) => {
  

    try {
      
      const userId = req.user.id
      console.log("userID", userId)
      const assessments = await Assessment.findAll({
        where: { userId },
        include: [
          {
            model: Response,
            include: [
              {
                model: Statement, 
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
