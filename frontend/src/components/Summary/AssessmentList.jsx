import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

const generatePDF = (assessmentId, stats, assessment, getContentForBehaviour) => {
  let y = 20;
  const lineHeight = 7;
  const doc = new jsPDF();

  const checkAddPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text("Sky Skills Assessment Summary", 20, y);
  y += 10;
  checkAddPage();

  // Intro paragraph
  const intro = 
    "This report is more than a reflection — it’s an invitation. An invitation to understand who you are at your best and how you show up for others. Whether you're someone who welcomes and includes, creates new possibilities, simplifies the complex, or always strives to do the right thing, your assessment reveals the unique blend of behaviours that make you you. Inside, you’ll find data-driven insights about your strengths, your impact on those around you, and how your behaviours align with Sky’s core values. Let it provoke curiosity. Ask yourself: Where do I shine? Where can I grow? This is your foundation — now build on it. Because growth doesn’t stop with one assessment, and neither should you.";

  doc.setFontSize(10);
  const introLines = doc.splitTextToSize(intro, 170);
  introLines.forEach(line => {
    doc.text(line, 20, y);
    y += lineHeight;
    checkAddPage();
  });

  y += 10

  const sortedBehaviours = [...stats.behaviourAverages].sort(
    (a, b) => b.averageScore - a.averageScore
  );
  const highestBehaviours = sortedBehaviours.slice(0, 3);
  const lowestBehaviours = sortedBehaviours.slice(-3);
  doc.setFontSize(14)
  doc.text("Your strongest features", 20, y)
  y+=10;
  highestBehaviours.forEach((behaviour) => {
    const behaviourLevel = getLevel(behaviour.averageScore)
    doc.text(`${behaviour.behaviourName}`, 25, y)
    y+=8;
  })
  y+=10;
  doc.setFontSize(14)
  doc.text("Your development areas", 20, y)
  y+=10;
  lowestBehaviours.forEach((behaviour) => {
    const behaviourLevel = getLevel(behaviour.averageScore)
    doc.text(`${behaviour.behaviourName}`, 25, y)
    y+=8;
  })

  y += 10

  stats.skillAverages.forEach((skill) => {
    doc.setFontSize(12);
    const skillTextY = y; // Store the Y position for the skill text
    doc.text(`${skill.skillName}`, 20, skillTextY);
    y += 5; // Add spacing between skill name and progress bar
    checkAddPage();

    // Progress bar
    const barX = 20; // Align with the left margin
    const barY = y; // Position below the skill name
    const barWidth = doc.internal.pageSize.getWidth() * 0.8; // 80% of page width
    const barHeight = 3;

    // Draw the background of the progress bar
    doc.setFillColor(211, 211, 211);
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'FD');

    // Calculate the fill width based on the average score
    const fillWidth = barWidth * (skill.averageScore / 4);
    doc.setFillColor(0, 123, 255);
    doc.roundedRect(barX, barY, fillWidth, barHeight, 2, 2, 'F');

    // Position the level text above the right side of the progress bar
    const levelText = `${getLevel(skill.averageScore)}`;
    doc.setFontSize(10);
    
    // Align the level text with the skill text vertically
    const levelTextX = barX + barWidth - doc.getTextWidth(levelText) - 5; // Adjust to position it on the right side
    const levelTextY = skillTextY; // Use the same Y position as the skill text

    // Draw the level text
    doc.text(levelText, levelTextX, levelTextY); // Position inline with the skill text

    y += barHeight + 10; // Add spacing after the progress bar
    checkAddPage();
  });



  //   const behaviours = stats.behaviourAverages.filter(b => b.skillId === skill.skillId);
  //   behaviours.forEach((behaviour) => {
  //     const behaviourLevel = getLevel(behaviour.averageScore);
  //     doc.text(`- ${behaviour.behaviourName}: ${behaviourLevel} (${behaviour.averageScore.toFixed(2)})`, 25, y);
  //     y += lineHeight;
  //     checkAddPage();

  //     const contentItems = getContentForBehaviour(behaviour.behaviourId);
  //     if (contentItems.length > 0) {
  //       contentItems.forEach((contentItem) => {
  //         const titleLines = doc.splitTextToSize(`• ${contentItem.title}`, 160);
  //         const descLines = doc.splitTextToSize(contentItem.description, 160);
  //         const link = contentItem.learningLinks?.[behaviourLevel];
  //         const linkText = link
  //           ? `Learning Link (${behaviourLevel}): ${link}`
  //           : `No learning link available for ${behaviourLevel}`;
  //         const linkLines = doc.splitTextToSize(linkText, 160);

  //         [...titleLines, ...descLines, ...linkLines].forEach(line => {
  //           doc.text(line, 30, y);
  //           y += lineHeight;
  //           checkAddPage();
  //         });

  //         y += 3;
  //       });
  //     } else {
  //       doc.text("  No content available for this behaviour.", 30, y);
  //       y += lineHeight;
  //       checkAddPage();
  //     }
  //   });

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