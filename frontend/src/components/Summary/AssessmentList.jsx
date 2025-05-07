import React from 'react';
import { jsPDF } from "jspdf"

const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

const generatePDF = (assessmentId, stats) => {
  let y = 20
  const doc = new jsPDF();
  doc.setFont("helvetica");
  doc.setFontSize(20)
  doc.text("Assessment Summary report", 20, y)
  y+=10
  doc.setFontSize(16)
  doc.text("Skills Breakdown", 20, y)
  doc.setFontSize(12)
  y+=10

  stats.skillAverages.forEach((skill) => {
    doc.text(`${skill.skillName} : ${getLevel(skill.averageScore)} (${skill.averageScore.toFixed(2)})`, 20, y)
    y+=10

    const behaviours = stats.behaviourAverages.filter((b) => b.skillId === skill.skillId)
    behaviours.forEach((behaviour) => {
      doc.text(` - ${behaviour.behaviourName} : ${getLevel(behaviour.averageScore)} (${behaviour.averageScore.toFixed(2)})`, 25, y)
      y+=10
  });
})
  doc.save(`assessment_${assessmentId}`)
}

const AssessmentList = ({assessments, hoveredId, setHoveredId, setSelectedAssessmentId, COLORS, stats}) => {
    return (
    <div className="side-list">
            {assessments.map((a, index) => (
              <div
                key={a.id}
                className="assessment-list-item"
                onClick={() => setSelectedAssessmentId(a.id)}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  color: COLORS[index % COLORS.length],
                  fontWeight: hoveredId === a.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                Assessment
                <br />
                <small>{new Date(a.createdAt).toLocaleDateString()}</small>
                <button onClick={() => generatePDF(a.id, stats[a.id])}>Download as PDF</button>
              </div>
              
            ))}
          </div>
    )
}

export default AssessmentList;