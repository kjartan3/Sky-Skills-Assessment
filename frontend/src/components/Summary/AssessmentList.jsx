import React from 'react';
import { jsPDF } from 'jspdf';

const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

const generatePDF = (assessmentId, stats, assessment, getContentForBehaviour) => {
  let y = 20;
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text("Assessment Summary Report", 20, y);
  y += 10;

  // Section header
  doc.setFontSize(16);
  doc.text("Skills Breakdown", 20, y);
  y += 12;
  doc.setFontSize(12);

  // Loop through each skill and draw its progress bar and breakdown
  stats.skillAverages.forEach((skill) => {
    // Print the skill name
    doc.text(`${skill.skillName}`, 20, y);

    // Draw progress bar parameters
    const barX = 80;         // x-coordinate where the bar starts
    const barY = y - 3;        // y, slightly above the text baseline
    const barWidth = 80;       // total width of the progress bar
    const barHeight = 3;       // height of the bar

    // Draw the background (border) of the progress bar (light gray)
    doc.setDrawColor(255, 255, 255)
    doc.setFillColor(211, 211, 211);
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'FD');

    // Calculate fill width; assuming maximum score is 4
    const fillWidth = barWidth * (skill.averageScore / 4);
    // Draw the filled portion (blue)
    doc.setFillColor(0, 123, 255);
    doc.roundedRect(barX, barY, fillWidth, barHeight, 2, 2, 'F');

    // Display the skill level and average score
    const skillLevelText = `${getLevel(skill.averageScore)} (${skill.averageScore.toFixed(2)})`;
    doc.text(skillLevelText, barX + barWidth + 5, y);
    y += 15;

    // Get all behaviours related to this skill
    const behaviours = stats.behaviourAverages.filter(b => b.skillId === skill.skillId);
    behaviours.forEach((behaviour) => {
      const behaviourLevel = getLevel(behaviour.averageScore);
      doc.text(` - ${behaviour.behaviourName}: ${behaviourLevel} (${behaviour.averageScore.toFixed(2)})`, 25, y);
      y += 10;

      // Use the passed in getContentForBehaviour function to get related content.
      const contentItems = getContentForBehaviour(behaviour.behaviourId);
      if (contentItems.length > 0) {
        contentItems.forEach((contentItem) => {
          // Content title and description
          doc.text(`    • ${contentItem.title}`, 30, y);
          y += 7;
          doc.text(`      ${contentItem.description}`, 30, y);
          y += 7;
          // Get the learning link for this content based on the behaviour's level
          const learningLink =
            contentItem.learningLinks &&
            contentItem.learningLinks[behaviourLevel];
          if (learningLink) {
            doc.text(`      Learning Link (${behaviourLevel}): ${learningLink}`, 30, y);
            y += 7;
          } else {
            doc.text(`      No learning link available for ${behaviourLevel}`, 30, y);
            y += 7;
          }
          y += 3;
        });
      } else {
        doc.text(`    No content available for this behaviour.`, 30, y);
        y += 10;
      }
    });
    y += 10;
  });

  doc.save(`assessment_${assessmentId}.pdf`);
};

const AssessmentList = ({
  assessments,
  hoveredId,
  setHoveredId,
  setSelectedAssessmentId,
  COLORS,
  stats,
  getContentForBehaviour, // Passed from parent
}) => {
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
            marginBottom: '10px'
          }}
        >
          <div>
            <strong>Assessment</strong>
            

            <small>{new Date(a.createdAt).toLocaleDateString()}</small>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Here we pass the entire assessment object and getContentForBehaviour to generatePDF.
              generatePDF(a.id, stats[a.id], a, getContentForBehaviour);
            }}
            style={{
              marginTop: '5px',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Download as PDF
          </button>
        </div>
      ))}
    </div>
  );
};

export default AssessmentList;

 