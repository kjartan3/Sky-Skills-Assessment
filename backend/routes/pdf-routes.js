import express from 'express'
import PDFDocument from "pdfkit"
import { Assessment } from '../models/index.js'
const router = express.Router();

router.get('/:assessmentId', async (req, res) => {
    console.log(`Recived request for assessment id : ${req.params.assessmentId}`)
    const { assessmentId } = req.params;
   
    try {
      const assessment = await Assessment.findByPk(assessmentId);
      if (!assessment) return res.status(404).send('Assessment not found');
   
      res.setHeader('Content-Disposition', `attachment; filename=assessment-${assessmentId}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
   
      const doc = new PDFDocument();
      doc.pipe(res);
   
      doc.fontSize(20).text('Assessment Summary Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Assessment ID: ${assessment.id}`);
     
      
   
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating PDF');
    }
  });
   
export default router;
